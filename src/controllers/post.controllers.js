const Post = require("../models/Post");

// Create new post
// POST /api/posts
const createPost = async (req, res, next) => {
	try {
		// Add user to req.body
		req.body.user = req.user.id;

		const post = await Post.create(req.body);

		res.status(201).json({
			success: true,
			data: post,
		});
	} catch (err) {
		next(err);
	}
};

// Get all posts
// GET /api/posts
const getPosts = async (req, res, next) => {
	try {
		// Only show published posts to the public
		const filter =
			req.user && req.user.role === "admin"
				? {}
				: { status: "published" };

		const posts = await Post.find(filter).populate({
			path: "user",
			select: "name email",
		});

		res.status(200).json({
			success: true,
			count: posts.length,
			data: posts,
		});
	} catch (err) {
		next(err);
	}
};

// Get user's posts
// GET /api/posts/my-posts
const getUserPosts = async (req, res, next) => {
	try {
		const posts = await Post.find({ user: req.user.id });

		res.status(200).json({
			success: true,
			count: posts.length,
			data: posts,
		});
	} catch (err) {
		next(err);
	}
};

// Get single post
// GET /api/posts/:id
const getSinglePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id).populate({
			path: "user",
			select: "name email",
		});

		if (!post) {
			return res.status(404).json({
				success: false,
				message: `No post found with id ${req.params.id}`,
			});
		}

		// Check if post is published or user is the owner or admin
		if (
			post.status !== "published" &&
			(!req.user ||
				(req.user.id !== post.user.toString() &&
					req.user.role !== "admin"))
		) {
			return res.status(403).json({
				success: false,
				message: "Not authorized to access this post",
			});
		}

		res.status(200).json({
			success: true,
			data: post,
		});
	} catch (err) {
		next(err);
	}
};

// Update post
// PUT /api/posts/:id
const updatePost = async (req, res, next) => {
	try {
		let post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: `No post found with id ${req.params.id}`,
			});
		}

		// Make sure user is post owner or admin
		if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Not authorized to update this post",
			});
		}

		post = await Post.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			success: true,
			data: post,
		});
	} catch (err) {
		next(err);
	}
};

// Delete single post
// DELETE /api/posts/:id
const deletePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: `No post found with id ${req.params.id}`,
			});
		}

		// Make sure user is post owner or admin
		if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Not authorized to delete this post",
			});
		}

		await post.remove();

		res.status(200).json({
			success: true,
			data: {},
		});
	} catch (err) {
		next(err);
	}
};


module.exports = {
    createPost,
    getPosts,
    getUserPosts,
    getSinglePost,
    updatePost,
    deletePost
};