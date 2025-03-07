import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/db";

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDb();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
