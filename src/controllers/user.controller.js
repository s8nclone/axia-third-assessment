const User = require("../models/User");
const KYC = require("../models/KYC");
const Post = require("../models/Post");

// Get all users
// GET /api/users
const getAllUsers = async (req, res, next) => {
	try {
		const users = await User.find();

		res.status(200).json({
			success: true,
			count: users.length,
			data: users,
		});
	} catch (err) {
		next(err);
	}
};

// Get single user
// GET /api/users/:id
const getSingleUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: `No user found with id ${req.params.id}`,
			});
		}

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (err) {
		next(err);
	}
};

// Update user
// PUT /api/users/:id
const updateSingleUser = async (req, res, next) => {
	try {
		// Make sure user is updating their own account or is an admin
		if (req.user.id !== req.params.id && req.user.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Not authorized to update this user",
			});
		}

		// Remove fields that shouldn't be updated via this endpoint
		delete req.body.password;
		delete req.body.role;

		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!user) {
			return res.status(404).json({
				success: false,
				message: `No user found with id ${req.params.id}`,
			});
		}

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (err) {
		next(err);
	}
};

// Delete user
// DELETE /api/users/:id
const deleteSingleUser = async (req, res, next) => {
	try {
		// Make sure user is deleting their own account or is an admin
		if (req.user.id !== req.params.id && req.user.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Not authorized to delete this user",
			});
		}

		const user = await User.findById(req.params.id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: `No user found with id ${req.params.id}`,
			});
		}

		// Delete the user's KYC document
		await KYC.findOneAndDelete({ user: req.params.id });

		// Delete all of the user's posts
		await Post.deleteMany({ user: req.params.id });

		// Delete the user
		await user.remove();

		res.status(200).json({
			success: true,
			data: {},
		});
	} catch (err) {
		next(err);
	}
};

module.exports = {
    getAllUsers,
    getSingleUser,
    updateSingleUser,
    deleteSingleUser
};
