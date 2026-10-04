import prisma from "../configs/prisma.js";

// Controller for checking if user is admin
export const isAdmin = async (req, res) => {
  try {
    return res.json({ isAdmin: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.code || error.message });
  }
};

// Controller for getting Dashboard data
export const getDashboard = async (req, res) => {
  try {
    const totalListings = await prisma.listing.count({});
    const transactions = await prisma.transaction.findMany({
      where: { isPaid: true },
      select: { amount: true },
    });
    const totalRevenue = transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0,
    );

    const activeListings = await prisma.listing.count({
      where: { status: "active" },
    });

    const totalUser = await prisma.user.count({});

    const recentListings = await prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { owner: true },
    });

    return res.json({
      dashboardData: {
        totalListings,
        totalRevenue,
        activeListings,
        totalUser,
        recentListings,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.code || error.message });
  }
};

// Controller for getting all listing
export const getAllListings = async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      include: { owner: true },
      orderBy: { createdAt: "desc" },
    });

    if (!listings || listings.length === 0) {
      return res.json({ listings: [] });
    }

    return res.json({ listings });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.code || error.message });
  }
};

// Change listing Status

export const changeStatus = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { status } = req.body;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return res.status(404).json({ message: "listing not found" });
    }

    await prisma.listing.update({
      where: { id: listingId },
      data: { status },
    });

    return res.json({ message: "Listing status updated" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.code || error.message });
  }
};
