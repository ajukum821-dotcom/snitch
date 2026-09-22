import { readAccessToken } from "../utils/auth.js";

export function authenticate(req, res, next) {
  try {
    // 1. Authorization Header se Access Token nikalna
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return res.status(400).json({
        message: "Access token not found in the request",
      });
    }

    // 2. Access Token Verify + Decode
    const decoded = readAccessToken(accessToken);

    // 3. User data request mein attach karna
    req.user = decoded;

    // 4. Next controller par jaana
    next();
  } catch (error) {
    console.error("Auth Error:", error);

    return res.status(401).json({
      status: false,
      message: "Invalid or expired access token",
    });
  }
}