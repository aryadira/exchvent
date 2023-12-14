const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/database.js");
const userRoute = require("./routes/user.route.js");
const authRoute = require("./routes/auth.route.js");

const urlDB = process.env.MONGODB_URL;

const app = express();
const PORT = process.env.PORT || 2703;

app.use(cors());
app.use(express.json());

// routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

// server
const activate = async () => {
  try {
    await connectDB(urlDB);
    app.listen(PORT, () => {
      console.log(`Server listening at port ${PORT}...`);
    });
  } catch (err) {
    console.log("Error connecting to MongoDB", err);
  }
};

activate();
