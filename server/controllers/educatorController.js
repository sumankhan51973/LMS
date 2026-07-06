import { clerkClient } from '@clerk/express'
import Course from '../models/Course.js'
import cloudinary from '../configs/cloudinary.js'
import { Purchase } from '../models/Purchase.js'
import User from '../models/User.js'
import mongoose from 'mongoose'
import EducatorRequest from "../models/EducatorRequest.js";

export const getRequestStatus = async (req, res) => {
  try {
    const userId = req.auth().userId;

    const request = await EducatorRequest.findOne({ userId });

    if (!request) {
      return res.json({
        success: true,
        status: null,
      });
    }

    res.json({
      success: true,
      status: request.status,
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// update user role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth().userId
        
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role: 'educator',
            }
        })
res.json({ success: true, message: 'You can publish a course now '})

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Student requests to become an educator
export const requestEducator = async (req, res) => {
  try {
    const userId = req.auth().userId;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // Check if already requested
    const existingRequest = await EducatorRequest.findOne({ userId });

    if (existingRequest) {
      return res.json({
        success: false,
        message: "You have already submitted a request.",
      });
    }

    // Save request
    await EducatorRequest.create({
      userId,
      name: user.name,
      email: user.email,
    });

    res.json({
      success: true,
      message: "Your educator request has been sent to the admin.",
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
}

// Add new Course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body
        const imageFile = req.file
        const educatorId = req.auth().userId

        if(!imageFile){
            return res.json({success: false, message: 'Course thumbnail not Attached'})
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({ success: true, message: 'Course added successfully'})

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// Get Educator Courses

export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth().userId;

    const courses = await Course.find({ educator });

    const updatedCourses = await Promise.all(
      courses.map(async (course) => {
        const students = await User.find(
          { enrolledCourses: course._id },
          'name imageUrl'
        );

        return {
          ...course.toObject(),
          enrolledStudents: students
        };
      })
    );

    res.json({
      success: true,
      courses: updatedCourses
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

//Get Educator Dashboard Data (Total Earning, Enrolled Students, No. of Courses )

export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth().userId
        const courses = await Course.find({ educator });
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Calculate total earning from purchases
        const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'completed' });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        //collect unique enrolled students IDs with their course titles 

       const enrolledStudentsData = [];

for (const course of courses) {
    const students = await User.find(
        { enrolledCourses: course._id },
        'name imageUrl'
    );

    students.forEach(student => {
        enrolledStudentsData.push({
            courseTitle: course.courseTitle,
            student
        });
    });
}

        res.json({ success: true, dashboardData: {
            totalEarnings, enrolledStudentsData, totalCourses
        }})

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Enrolled Students data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth().userId;
        const courses = await Course.find({ educator });
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'completed' }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({ success: true, enrolledStudents });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}