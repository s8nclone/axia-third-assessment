const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: {
			type: String,
			required: [true, "Please add a title"],
			trim: true,
			maxlength: [100, "Title cannot be more than 100 characters"],
		},
		content: {
			type: String,
			required: [true, "Please add content"],
			maxlength: [5000, "Content cannot be more than 5000 characters"],
		},
		tags: {
			type: [String],
			default: [],
		},
		status: {
			type: String,
			enum: ["draft", "published", "archived"],
			default: "published",
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Update the updatedAt timestamp before saving
PostSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

module.exports = mongoose.model("Post", PostSchema);
