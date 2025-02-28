const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const User = require("../models/User.models");

exports.protect = async (req, res, next) => {
	let token;

	// Check if auth header exists and starts with Bearer
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		// Set token from Bearer token in header
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		return res.status(401).json({
			success: false,
			message: "Not authorized to access this route",
		});
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, JWT_SECRET);

		// Check if user still exists
		const user = await User.findById(decoded.id);

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "The user belonging no longer exists",
			});
		}

		// Add user to request object
		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({
			success: false,
			message: "Not authorized to access this route",
		});
	}
};

exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({
				success: false,
				message: `User role ${req.user.role} is not authorized to access this route`,
			});
		}
		next();
	};
};
