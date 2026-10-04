import { clerkClient } from "@clerk/express";

export const protect = async (req, res, next) => {
  try {
    const { userId, has } = await req.auth();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const hasPremiumPlan = await has({ plan: "premium" });
    req.plan = hasPremiumPlan ? "premium" : "free";
    return next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.code || error.message });
  }
};
export const protectAdmin = async (req, res, next) => {
  try {
    const { user } = await clerkClient.users.getUser(await req.auth().userId);
    const isAdmin = process.env.ADMIN_EMAILS.split(",").includes(
      user.emailAddresses[0].emailAddress,
    );

    if (!isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.code || error.message });
  }
};
// import prisma from "../configs/prisma.js";

// export const protect = async (req, res, next) => {
//   try {
//     const { userId, has } = await req.auth();

//     if (!userId) {
//       return res.status(401).json({
//         message: "Unauthorized",
//       });
//     }

//     // Check if Clerk user exists in Prisma
//     let user = await prisma.user.findUnique({
//       where: {
//         id: userId,
//       },
//     });

//     // If user doesn't exist in Prisma, create it
//     if (!user) {
//       console.log("Creating missing Prisma user:", userId);

//       user = await prisma.user.create({
//         data: {
//           id: userId,
//           email: "",
//           name: "",
//           image: "",
//         },
//       });
//     }

//     const hasPremiumPlan = await has({
//       plan: "premium",
//     });

//     req.plan = hasPremiumPlan ? "premium" : "free";

//     return next();
//   } catch (error) {
//     console.log("Protect middleware error:", error);

//     return res.status(401).json({
//       message: error.code || error.message,
//     });
//   }
// };
