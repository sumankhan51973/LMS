import express from "express";
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
  requestEducator,
  getRequestStatus,
} from "../controllers/educatorController.js";

import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

// Student requests educator access
educatorRouter.post("/request", requestEducator);
educatorRouter.get("/request-status", getRequestStatus);

// Old route (keep for now)
educatorRouter.get("/update-role", updateRoleToEducator);

// Educator-only routes
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse
);

educatorRouter.get("/courses", protectEducator, getEducatorCourses);

educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);

educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);

export default educatorRouter;