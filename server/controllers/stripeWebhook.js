import { err } from "inngest/types";
import stripe from "stripe";
import prisma from "../configs/prisma.js";
import { inngest } from "../inngest/index.js";

export const stripeWebhook = async (request, response) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret,
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }

    try {
      switch (event.type) {
        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object;

          const sessionList = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntent.id,
            limit: 1,
          });

          const session = sessionList.data[0];

          if (!session) {
            throw new Error("Stripe checkout session not found");
          }

          const { transactionId, appId } = session.metadata ?? {};

          if (appId === "flipearn" && transactionId) {
            const transaction = await prisma.transaction.update({
              where: { id: transactionId },
              data: { isPaid: true },
            });

            await inngest.send({
              name: "app/purchase",
              data: { transaction },
            });

            await prisma.listing.update({
              where: { id: transaction.listingId },
              data: { status: "sold" },
            });

            await prisma.user.update({
              where: { id: transaction.ownerId },
              data: {
                earned: { increment: transaction.amount },
              },
            });
          }

          break;
        }

        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}.`);
      }

      // Return a 200 response to acknowledge receipt of the event
      response.send();
    } catch (error) {
      console.error("Webhook processing error:", error);
      response.status(500).send("Internal Server Error");
    }
  }
};
