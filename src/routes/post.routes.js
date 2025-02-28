const express = require("express");
const {
	createPost,
	getPosts,
	getUserPosts,
	getSinglePost,
	updatePost,
	deletePost,
} = require("../controllers/post.controllers");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes
router.get("/", getPosts);
router.get("/:id", getSinglePost);

// Protected routes
router.use(protect);

router.get("/user/my-posts", getUserPosts);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
