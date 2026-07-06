import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'
import './configs/cloudinary.js'
import adminRouter from './routes/adminRoutes.js'

const app = express()

await connectDB()

// CORS
app.use(cors())

// ✅ Stripe webhook BEFORE express.json()
app.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhooks
)

// ✅ JSON parser AFTER webhook
app.use(express.json())

// Clerk
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => {
  res.send('API Working')
})

app.post('/clerk', clerkWebhooks)

app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})