import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;


app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Database connected successfully");
});