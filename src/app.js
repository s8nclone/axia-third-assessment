const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// const errorHandler = require("./middlewares/errorHandler");

// Route files
// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const kycRoutes = require("./routes/kycRoutes");
// const postRoutes = require("./routes/postRoutes");

// Create Express app
const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Mount routers
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/kyc", kycRoutes);
// app.use("/api/posts", postRoutes);

// Basic route
app.get("/", (req, res) => {
	res.json({
		success: true,
		message: "API is running",
	});
});

// Error handler (should be last middleware)
// app.use(errorHandler);

module.exports = app;
