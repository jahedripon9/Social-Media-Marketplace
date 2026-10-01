import express from "express";
import {
  addCredential,
  addListing,
  deleteUserListing,
  getAllPublicListing,
  getAllUserListing,
  getAllUserOrders,
  markFeatured,
  purchaseAccount,
  toggleStatus,
  updateListing,
  withdrawAmount,
} from "../controllers/listingControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const listingRouter = express.Router();

listingRouter.post("/", upload.array("images", 5), protect, addListing);
listingRouter.put("/", upload.array("images", 5), protect, updateListing);
listingRouter.get("/public", getAllPublicListing);
listingRouter.get("/user", getAllUserListing);
listingRouter.put("/:id/status", protect, toggleStatus);
listingRouter.delete("/:listingId", protect, deleteUserListing);
listingRouter.post("/add-credential", protect, addCredential);
listingRouter.put("/featured/:id", protect, markFeatured);
listingRouter.get("/user-orders", protect, getAllUserOrders);
listingRouter.post("/withdraw", protect, withdrawAmount);
listingRouter.post("/purchase-account/:listingId", protect, purchaseAccount);

export default listingRouter;
