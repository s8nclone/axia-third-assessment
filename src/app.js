const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const kycRoutes = require("./routes/kyc.routes");
const postRoutes = require("./routes/post.routes");

const app = express();

app.use(express.json());

// enable CORS
app.use(cors());

// dev logging middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// routers
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/posts", postRoutes);

// home route
app.get("/", (req, res) => {
	res.json({
		success: true,
		message: "API is running",
	});
});

module.exports = app;
