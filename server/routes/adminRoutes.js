import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getRequests,
  approveRequest,
  rejectRequest,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Get all educator requests
adminRouter.get("/requests", requireAuth(), getRequests);

// Approve educator
adminRouter.put("/approve/:id", requireAuth(), approveRequest);

// Reject educator
adminRouter.put("/reject/:id", requireAuth(), rejectRequest);

export default adminRouter;