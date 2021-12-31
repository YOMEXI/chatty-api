import dotenv from "dotenv";
import { ConnectOptions, connect } from "mongoose";

dotenv.config();

export const DB = () => {
  try {
    connect(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    } as ConnectOptions);
    console.log("DB Connected");
  } catch (error) {
    console.log("DB Connection Failed");
  }
};
