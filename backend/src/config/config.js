import dotenv from "dotenv";
dotenv.config();
const config = {
  MONGODB_URI: process.env.MONGODB_URI,
  ACCESS_TOKEN_SCERET: process.env.ACCESS_TOKEN_SCERET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};
export default config;
