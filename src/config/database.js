const mongoose = require("mongoose");
const { MONGO_URI } = require("./env");

const options = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
};

const connectDB = async () => {
	try {
		const connect = await mongoose.connect(MONGO_URI, options);
		console.log(`MongoDB Connected: ${connect.connection.host}`);
		return connect;
	} catch (error) {
		console.error(`Error connecting to MongoDB: ${error.message}`);
		process.exit(1);
	}
};

module.exports = connectDB;
