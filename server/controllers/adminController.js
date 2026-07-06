import { clerkClient } from "@clerk/express";
import EducatorRequest from "../models/EducatorRequest.js";

// Change this to your Clerk account email
const ADMIN_EMAIL = "sumankhan51973@gmail.com";

// Check if current user is admin
const isAdmin = async (userId) => {
  const user = await clerkClient.users.getUser(userId);

  return (
    user.emailAddresses[0].emailAddress.toLowerCase() ===
    ADMIN_EMAIL.toLowerCase()
  );
};

// Get all educator requests
export const getRequests = async (req, res) => {
  try {
    const userId = req.auth().userId;

    if (!(await isAdmin(userId))) {
      return res.status(403).json({
        success: false,
        message: "Only Admin can access this.",
      });
    }

    const requests = await EducatorRequest.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Approve educator request
export const approveRequest = async (req, res) => {
  try {
    const adminId = req.auth().userId;

    if (!(await isAdmin(adminId))) {
      return res.status(403).json({
        success: false,
        message: "Only Admin can approve.",
      });
    }

    const { id } = req.params;

    const request = await EducatorRequest.findById(id);

    if (!request) {
      return res.json({
        success: false,
        message: "Request not found",
      });
    }

    // Update Clerk role
    await clerkClient.users.updateUserMetadata(request.userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    // Update request status
    request.status = "approved";
    await request.save();

    res.json({
      success: true,
      message: "Educator approved successfully.",
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Reject educator request
export const rejectRequest = async (req, res) => {
  try {
    const adminId = req.auth().userId;

    if (!(await isAdmin(adminId))) {
      return res.status(403).json({
        success: false,
        message: "Only Admin can reject.",
      });
    }

    const { id } = req.params;

    await EducatorRequest.findByIdAndUpdate(id, {
      status: "rejected",
    });

    res.json({
      success: true,
      message: "Request rejected.",
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};