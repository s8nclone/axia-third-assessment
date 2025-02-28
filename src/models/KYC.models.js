const mongoose = require("mongoose");

const KYCSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true, // Ensures one-to-one relationship
	},
	idType: {
		type: String,
		required: [true, "Please specify ID type"],
		enum: ["passport", "driverLicense", "nationalID", "other"],
	},
	idNumber: {
		type: String,
		required: [true, "Please provide ID number"],
		trim: true,
	},
	address: {
		street: String,
		city: {
			type: String,
			required: [true, "Please provide city"],
		},
		state: {
            type: String,
            required: [true, "Please provide state"],
        },
		postalCode: {
			type: String,
			required: [true, "Please provide postal code"],
		},
		country: {
			type: String,
			required: [true, "Please provide country"],
		},
	},
	dateOfBirth: {
		type: Date,
		required: [true, "Please provide date of birth"],
	},
	verificationStatus: {
		type: String,
		enum: ["pending", "verified", "rejected"],
		default: "pending",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Update the updatedAt timestamp before saving
KYCSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

module.exports = mongoose.model("KYC", KYCSchema);
