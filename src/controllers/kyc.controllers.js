const KYC = require("../models/KYC");

// Create KYC document
// POST /api/kyc
const createKYC = async (req, res, next) => {
	try {
		// Check if user already has a KYC document
		const existingKYC = await KYC.findOne({ user: req.user.id });

		if (existingKYC) {
			return res.status(400).json({
				success: false,
				message:
					"User already has a KYC document. Please update it instead.",
			});
		}

		// Add user to req.body
		req.body.user = req.user.id;

		const kyc = await KYC.create(req.body);

		res.status(201).json({
			success: true,
			data: kyc,
		});
	} catch (err) {
		next(err);
	}
};

// Get user's KYC document
// GET /api/kyc
const getKYC = async (req, res, next) => {
	try {
		const kyc = await KYC.findOne({ user: req.user.id });

		if (!kyc) {
			return res.status(404).json({
				success: false,
				message: "No KYC document found for this user",
			});
		}

		res.status(200).json({
			success: true,
			data: kyc,
		});
	} catch (err) {
		next(err);
	}
};

// Update user's KYC document
// PUT /api/kyc
const updateKYC = async (req, res, next) => {
	try {
		let kyc = await KYC.findOne({ user: req.user.id });

		if (!kyc) {
			return res.status(404).json({
				success: false,
				message: "No KYC document found for this user",
			});
		}

		// Reset verification status if critical fields are changed
		if (req.body.idType || req.body.idNumber || req.body.dateOfBirth) {
			req.body.verificationStatus = "pending";
		}

		kyc = await KYC.findOneAndUpdate({ user: req.user.id }, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			success: true,
			data: kyc,
		});
	} catch (err) {
		next(err);
	}
};

// Delete user's KYC document
// DELETE /api/kyc
const deleteKYC = async (req, res, next) => {
	try {
		const kyc = await KYC.findOne({ user: req.user.id });

		if (!kyc) {
			return res.status(404).json({
				success: false,
				message: "No KYC document found for this user",
			});
		}

		await kyc.remove();

		res.status(200).json({
			success: true,
			data: {},
		});
	} catch (err) {
		next(err);
	}
};

module.exports = {
    createKYC,
    getKYC,
    updateKYC,
    deleteKYC
};
