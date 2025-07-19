const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected Successfully");
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
};

module.exports = dbConnect;
