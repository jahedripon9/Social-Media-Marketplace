import { err } from "inngest/types";
import imagekit from "../configs/imageKit.js";
import prisma from "../configs/prisma.js";
import fs from "fs";
import Stripe from "stripe";
import { inngest } from "../inngest/index.js";

// Controller for Adding Listing to Database
export const addListing = async (req, res) => {
  try {
    const { userId } = await req.auth();
    if (req.plan !== "premium") {
      const listingCount = await prisma.listing.count({
        where: { ownerId: userId },
      });
      if (listingCount >= 5) {
        return res.status(400).json({
          message: "you have reached the free listing limit",
        });
      }
    }
    const accountDetails = JSON.parse(req.body.accountDetails);

    accountDetails.followers_count = parseFloat(accountDetails.followers_count);
    accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate);
    accountDetails.monthly_views = parseFloat(accountDetails.monthly_views);
    accountDetails.price = parseFloat(accountDetails.price);
    accountDetails.platform = accountDetails.platform.toLowerCase();
    accountDetails.niche = accountDetails.niche.toLowerCase();

    accountDetails.username.startsWith("@")
      ? (accountDetails.username = accountDetails.username.slice(1))
      : null;

    const uploadImages = req.files.map(async (file) => {
      const response = await imagekit.files.upload({
        file: fs.createReadStream(file.path),
        fileName: `${Date.now()}.png`,
        folder: "flip-earn",
        transformation: { pre: "w-1280,h-auto" },
      });
      return response.url;
    });

    // Wait for all uploads to complete
    const images = await Promise.all(uploadImages);
    const listing = await prisma.listing.create({
      data: {
        ownerId: userId,
        images,
        ...accountDetails,
      },
    });
    return res
      .status(201)
      .json({ message: "Account Listed successfully", listing });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
//Controller For Getting All Listing
export const getAllPublicListing = async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: "active" },
      include: { owner: true },
      orderBy: { createdAt: "desc" },
    });
    if (!listings || listings.length === 0) {
      return res.json({ listings: [] });
    }
    return res.json({ listings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

// Controller for Getting All User Listing
export const getAllUserListing = async (req, res) => {
  try {
    const { userId } = await req.auth();

    console.log("getAllUserListing userId:", userId);

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const listings = await prisma.listing.findMany({
      where: {
        ownerId: userId,
        status: {
          not: "deleted",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    console.log("getAllUserListing user:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found in database",
        userId,
      });
    }

    const earned = user.earned ?? 0;
    const withdrawn = user.withdrawn ?? 0;

    const balance = {
      earned,
      withdrawn,
      available: earned - withdrawn,
    };

    return res.json({
      listings,
      balance,
    });
  } catch (error) {
    console.log("Get All User Listing Error:", error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};
// export const getAllUserListing = async (req, res) => {
//   try {
//     const { userId } = await req.auth();
//     // get all listings export deleted
//     const listings = await prisma.listing.findMany({
//       where: { ownerId: userId, status: { not: "deleted" } },
//       orderBy: { createdAt: "desc" },
//     });

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     const balance = {
//       earned: user.earned,
//       withdrawn: user.withdrawn,
//       available: user.earned - user.withdrawn,
//     };
//     if (!listings || listings.length === 0) {
//       return res.json({ listings: [], balance });
//     }
//     return res.json({ listings, balance });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.code || error.message });
//   }
// };

// // Controller For Updating Listing in Database
// export const updateListing = async (req, res) => {
//   try {
//     const { userId } = await req.auth();
//     const accountDetails = JSON.parse(req.body.accountDetails);

//     if (req.files.length + accountDetails.images.length > 5) {
//       return res
//         .status(400)
//         .json({ message: "You can only upload up to 5 images" });
//     }

//     accountDetails.followers_count = parseFloat(accountDetails.followers_count);
//     accountDetails.engagement_rate = parseFloat(accountDetails.engagement_rate);
//     accountDetails.monthly_views = parseFloat(accountDetails.monthly_views);
//     accountDetails.price = parseFloat(accountDetails.price);
//     accountDetails.platform = accountDetails.platform.toLowerCase();
//     accountDetails.niche = accountDetails.niche.toLowerCase();

//     const listing = await prisma.listing.update({
//       where: { id: accountDetails.id, ownerId: userId },
//       data: accountDetails,
//     });

//     if (!listing) {
//       return res.status(404).json({ message: "Listing not found" });
//     }

//     if (listing.status === "sold") {
//       return res.status(400).json({ message: "you can't update sold listing" });
//     }

//     if (req.files.length > 0) {
//       const uploadImages = req.files.map(async (file) => {
//         const response = await imagekit.files.upload({
//           file: fs.createReadStream(file.path),
//           fileName: `${Date.now()}.png`,
//           folder: "flip-earn",
//           transformation: { pre: "w-1280,h-auto" },
//         });
//         return response.url;
//       });

//       // Wait for all uploads to complete
//       const images = await Promise.all(uploadImages);

//       const listing = await prisma.listing.create({
//         // where: { id: accountDetails, ownerId: userId },
//         data: {
//           ownerId: userId,
//           ...accountDetails,
//           images: [...accountDetails.images, ...images],
//         },
//       });
//       return res.json({ message: "Account Updated Successfully", listing });
//     }
//     return res.json({ message: "Account Updated Successfully", listing });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.code || error.message });
//   }
// };
// Controller For Updating Listing in Database
export const updateListing = async (req, res) => {
  try {
    const { userId } = await req.auth();

    if (!req.body.accountDetails) {
      return res.status(400).json({
        message: "accountDetails is required",
      });
    }

    const accountDetails = JSON.parse(req.body.accountDetails);

    const listingId = accountDetails.id;

    if (!listingId) {
      return res.status(400).json({
        message: "Listing ID is required",
      });
    }

    // Multer files may be undefined
    const files = req.files || [];

    // Existing images
    const existingImages = Array.isArray(accountDetails.images)
      ? accountDetails.images
      : [];

    // Maximum 5 images
    if (files.length + existingImages.length > 5) {
      return res.status(400).json({
        message: "You can only upload up to 5 images",
      });
    }

    // Find listing owned by current user
    const existingListing = await prisma.listing.findFirst({
      where: {
        id: listingId,
        ownerId: userId,
      },
    });

    if (!existingListing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // Sold listing cannot be updated
    if (existingListing.status === "sold") {
      return res.status(400).json({
        message: "You can't update sold listing",
      });
    }

    // Convert numeric fields
    accountDetails.followers_count = Number(accountDetails.followers_count);

    accountDetails.engagement_rate = Number(accountDetails.engagement_rate);

    accountDetails.monthly_views = Number(accountDetails.monthly_views);

    accountDetails.price = Number(accountDetails.price);

    // Normalize text
    if (accountDetails.platform) {
      accountDetails.platform = accountDetails.platform.toLowerCase();
    }

    if (accountDetails.niche) {
      accountDetails.niche = accountDetails.niche.toLowerCase();
    }

    // Upload new images
    let newImages = [];

    if (files.length > 0) {
      const uploadImages = files.map(async (file) => {
        const response = await imagekit.files.upload({
          file: fs.createReadStream(file.path),
          fileName: `${Date.now()}-${file.originalname}`,
          folder: "flip-earn",
          transformation: {
            pre: "w-1280,h-auto",
          },
        });

        return response.url;
      });

      newImages = await Promise.all(uploadImages);
    }

    // Combine old + new images
    const images = [...existingImages, ...newImages];

    // Don't send id/ownerId manually
    const { id, ownerId, ...updateData } = accountDetails;

    updateData.images = images;

    const listing = await prisma.listing.update({
      where: {
        id: listingId,
      },
      data: updateData,
    });

    return res.json({
      message: "Account Updated Successfully",
      listing,
    });
  } catch (error) {
    console.error("Update Listing Error:", error);

    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};
// Toggle Status

export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = await req.auth();

    const listing = await prisma.listing.findUnique({
      where: { id, ownerId: userId },
    });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    if (listing.status === "active" || listing.status === "inactive") {
      await prisma.listing.update({
        where: { id, ownerId: userId },
        data: { status: listing.status === "active" ? "inactive" : "active" },
      });
    } else if (listing.status === "ban") {
      return res.status(400).json({ message: "Your listing is banned" });
    } else if (listing.status === "sold") {
      return res.status(400).json({ message: "Your listing is sold" });
    }
    return res.json({ message: "Listing status updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

// Delete User Listing

export const deleteUserListing = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { listingId } = req.params;

    const listing = await prisma.listing.findFirst({
      where: { id: listingId, ownerId: userId },
      include: { owner: true },
    });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (!listing.status === "sold") {
      return res.status(400).json({ message: "sold listing can't be deleted" });
    }

    // If password has been changed, send the new password to the owner
    if (listing.isCredentialChanged) {
      await inngest.send({
        name: "app/listing-deleted",
        data: { listing, listingId },
      });
    }

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: "deleted",
      },
    });
    return res.json({ message: "listing deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

// Add Credential

export const addCredential = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { listingId, credential } = req.body;
    if (credential.length === 0 || !listingId) {
      return res.status(400).json({ message: "Missing Fields" });
    }

    const listing = await prisma.listing.findFirst({
      where: { id: listingId, ownerId: userId },
    });
    if (!listing) {
      return res
        .status(404)
        .json({ message: "Listing not found or you are not the owner" });
    }

    await prisma.credential.create({
      data: {
        listingId,
        originalCredential: credential,
      },
    });

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        isCredentialSubmitted: true,
      },
    });

    return res.json({ message: "Credential added Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
// Mark Featured

export const markFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = await req.auth();
    if (req.plan !== "premium") {
      return res.status(400).json({ message: "Premium plan required" });
    }
    // unset all other  feathered Listings

    await prisma.listing.updateMany({
      where: { ownerId: userId },
      data: { featured: false },
    });

    // Mark the listing as feathered
    await prisma.listing.update({
      where: { id },
      data: { featured: true },
    });

    return res.json({ message: "Listing marked as featured " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

//Get All User Orders
export const getAllUserOrders = async (req, res) => {
  try {
    const { userId } = await req.auth();
    let orders = await prisma.transaction.findMany({
      where: { userId, isPaid: true },
      include: { listing: true },
    });

    if (!orders || orders.length === 0) {
      return res.json({ orders: [] });
    }
    // Attach the credential to each order
    const credentials = await prisma.credential.findMany({
      where: { listingId: { in: orders.map((order) => order.listingId) } },
    });

    const orderWithCredentials = orders.map((order) => {
      const credential = credentials.find(
        (cred) => cred.listingId === order.listingId,
      );
      return { ...order, credential };
    });

    return res.json({ orders: orderWithCredentials });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};

//Withdraw Amount
// export const withdrawAmount = async (req, res) => {
//   try {
//     const { userId } = await req.auth();
//     const { amount, account } = req.body;

//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     const balance = user.earned - user.withdrawn;

//     if (amount > balance) {
//       return res.status(400).json({ message: "Insufficient Balance" });
//     }

//     const withdrawal = await prisma.withdrawal.create({
//       data: {
//         userId,
//         amount,
//         account,
//       },
//     });

//     await prisma.user.update({
//       where: { id: userId },
//       data: { withdrawn: { increment: account } },
//     });

//     return res.json({ message: "Applied for withdrawal", withdrawal });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.code || error.message });
//   }
// };

export const withdrawAmount = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { amount, account } = req.body;

    const withdrawalAmount = Number(amount);

    if (!Number.isFinite(withdrawalAmount) || withdrawalAmount <= 0) {
      return res.status(400).json({
        message: "Invalid withdrawal amount",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const balance = user.earned - user.withdrawn;

    if (withdrawalAmount > balance) {
      return res.status(400).json({
        message: "Insufficient Balance",
      });
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId,
        amount: withdrawalAmount,
        account,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        withdrawn: {
          increment: withdrawalAmount,
        },
      },
    });

    return res.json({
      message: "Applied for withdrawal",
      withdrawal,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.code || error.message,
    });
  }
};



//Purchase Account
export const purchaseAccount = async (req, res) => {
  try {
    const { userId } = await req.auth();
    const { listingId } = req.params;
    const { origin } = req.headers;

    const listing = await prisma.listing.findFirst({
      where: { id: listingId, status: "active" },
    });

    if (!listing) {
      return res
        .status(404)
        .json({ message: "Listing not found or not active" });
    }

    if (listing.ownerId === userId) {
      return res
        .status(400)
        .json({ message: "You can't purchase your own listing" });
    }

    const transaction = await prisma.transaction.create({
      data: {
        listingId,
        ownerId: listing.ownerId,
        userId,
        amount: listing.price,
      },
    });

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-orders`,
      cancel_url: `${origin}/marketplace`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Purchasing Account @${listing.username} of ${listing.platform}`,
            },
            unit_amount: Math.floor(transaction.amount) * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        transactionId: transaction.id,
        appId: "flipearn",
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, //Expires in 30 minutes
    });
    return res.json({ paymentLink: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.code || error.message });
  }
};
