const User = require("../models/User.models");
const { JWT_EXPIRE } = require("../config/env");

// Register user
// POST /api/auth/register
const register = async (req, res, next) => {
	try {
		const { name, email, password, role } = req.body;

		// Create user
		const user = await User.create({
			name,
			email,
			password,
			role,
		});

		sendTokenResponse(user, 201, res);
	} catch (err) {
		next(err);
	}
};

// Login user
// POST /api/auth/login
const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		// Validate email & password
		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Please provide an email and password",
			});
		}

		// Check for user
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		// Check if password matches
		const isMatch = await user.matchPassword(password);

		if (!isMatch) {
			return res.status(401).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		sendTokenResponse(user, 200, res);
	} catch (err) {
		next(err);
	}
};

// Get current logged in user
// GET /api/auth/me
const getMe = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (err) {
		next(err);
	}
};

// Log user out and clear cookie
// GET /api/auth/logout
const logout = async (req, res, next) => {
	res.status(200).json({
		success: true,
		data: {},
	});
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
	// Create token
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(Date.now() + JWT_EXPIRE * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === "production") {
		options.secure = true;
	}

	res.status(statusCode).json({
		success: true,
		token,
	});
};

module.exports = {
	register,
	login,
	getMe,
	logout,
};
