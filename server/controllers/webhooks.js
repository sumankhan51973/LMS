import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

// ==========================
// Clerk Webhook
// ==========================

export const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        const { data, type } = req.body;

        switch (type) {
            case "user.created":
                await User.create({
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    imageUrl: data.image_url,
                });
                break;

            case "user.updated":
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    imageUrl: data.image_url,
                });
                break;

            case "user.deleted":
                await User.findByIdAndDelete(data.id);
                break;

            default:
                console.log("Unhandled Clerk Event:", type);
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================
// Stripe Webhook
// ==========================

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (req, res) => {

    console.log("Stripe Webhook Called");

    const signature = req.headers["stripe-signature"];

    let event;

    try {

        event = stripeInstance.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );

    } catch (err) {

        console.log("Webhook Verification Failed");
        console.log(err.message);

        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {

        switch (event.type) {

            case "checkout.session.completed": {

                console.log("Checkout Completed");

                const session = event.data.object;

                const purchaseId = session.metadata.purchaseId;

                console.log("Purchase ID:", purchaseId);

                const purchase = await Purchase.findById(purchaseId);

                if (!purchase) {
                    console.log("Purchase Not Found");
                    break;
                }

                const user = await User.findById(purchase.userId);
                const course = await Course.findById(purchase.courseId);

                if (!user || !course) {
                    console.log("User or Course Not Found");
                    break;
                }

                // Enroll user
                if (!user.enrolledCourses.includes(course._id)) {
                    user.enrolledCourses.push(course._id);
                    await user.save();
                }

                // Add student
                if (!course.enrolledStudents.includes(user._id)) {
                    course.enrolledStudents.push(user._id);
                    await course.save();
                }

                purchase.status = "completed";
                await purchase.save();

                console.log("Enrollment Successful");

                break;
            }

            case "checkout.session.expired": {

                const session = event.data.object;

                const purchaseId = session.metadata.purchaseId;

                await Purchase.findByIdAndUpdate(
                    purchaseId,
                    {
                        status: "failed",
                    }
                );

                console.log("Checkout Expired");

                break;
            }

            default:
                console.log(`Unhandled Event: ${event.type}`);
        }

        return res.json({
            received: true,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};