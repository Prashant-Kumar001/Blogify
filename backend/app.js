import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import blogRoutes from "./src/routes/blogRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import likeRouters from "./src/routes/likeRouters.js";
import followRouters from "./src/routes/followRoutes.js";
import { errorHandler, notFound } from "./src/middlewares/errorHandler.js";
import requestIdMiddleware from "./src/middlewares/requestIdMiddleware.js";
import setupSwagger from "./src/utils/swagger.js";
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true, // Include the cookie in the requests
  secure: true, // Only include the cookie if the request is secure (https)
}));
app.use(express.json());
app.use(morgan("combined"));
app.use(cookieParser());

// Swagger

setupSwagger(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 1000, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// Data Sanitization against XSS
app.use(xss());

// Data Sanitization against NoSQL Injection
app.use(mongoSanitize());

// Request ID Middleware
app.use(requestIdMiddleware);

// Routes
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/like", likeRouters);
app.use("/api/follow", followRouters);

// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);

export default app;
