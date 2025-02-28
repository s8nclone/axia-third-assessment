const express = require("express");
const {
	createKYC,
	getKYC,
	updateKYC,
	deleteKYC,
} = require("../controllers/kyc.controllers");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);

router.route("/").post(createKYC).get(getKYC).put(updateKYC).delete(deleteKYC);

module.exports = router;
