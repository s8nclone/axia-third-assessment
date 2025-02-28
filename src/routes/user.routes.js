const express = require("express");
const {
	getAllUsers,
	getSingleUser,
	updateSingleUser,
	deleteSingleUser,
} = require("../controllers/user.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.route("/").get(authorize("admin"), getAllUsers);

router
	.route("/:id")
	.get(authorize("admin"), getSingleUser)
	.put(updateSingleUser)
	.delete(deleteSingleUser);

module.exports = router;
