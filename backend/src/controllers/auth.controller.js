import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
  readRefreshToken,
} from "../utils/auth.js";
const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check is user already exists
    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
      return res.status(400).json({
        status: false,
        message: "User already exits in database",
        errors: [
          {
            path: email,
            message: "Email already exits",
          },
        ],
      });
    }
    //create user
    const user = await userModel.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
    });
    //genreate token
    const accessToken = createAccessToken({
      userId: user._id,
      role: user.role,
    });
    const refreshToken = createRefreshToken({
      userId: user._id,
      role: user.role,
    });
    //add refreshToken cookies in response
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });
    //find and update user in database
    await userModel.findByIdAndUpdate(user._id, {
      refreshToken,
    });
    res.status(200).json({
      message: "User registered Successfully",
      data: {
        user: {
          email: user.email,
          name: user.name,
          id: user._id,
        },
        accessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

//LoginController
//read email and password from req body
//find user and mssage
//compare password and message
//create accessToken and refresh token
//findoneAndUpdate user
//add refreshToken in cookies
//response
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Invalid email address",
      });
    }
    //compar password
    const isPasswordisValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordisValid) {
      return res.status(400).json({
        status: false,
        message: "Inalid email and password",
      });
    }

    //create accessToken and reresfhToken
    const accessToken = createAccessToken({
      userId: user._id,
      role: user.role,
    });
    const refreshToken = createRefreshToken({
      userId: user._id,
      role: user.role,
    });

    await userModel.findOneAndUpdate(
      {
        email,
      },
      {
        refreshToken,
      },
    );
    //save refresh token in cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });
    res.status(200).json({
      status: true,
      message: "user logged in successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        accessToken,
      },
    });
  } catch (error) {
    console.error("Failed to login", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
//RefreshToken
// 1. Browser se refresh token cookie se lena and message
// 2.  Refresh Token Verify + Decode
// 3. Decoded token se userId aur role nikalna
// 4. userId se MongoDB mein user find karna
// 5. Refresh Token Mismatch Check
// 6. New Access Token Generate karna
// 7. New Refresh Token Generate karna
// 8. New Refresh Token Database mein save karna
// 9. New Refresh Token browser cookie mein save karna
// 10. Response send karna

const refreshToken = async (req, res) => {
  try {
    // --------------------------------------------------
    // 1. Browser se refresh token cookie se lena
    // --------------------------------------------------
    const refreshToken = req.cookies.refreshToken;

    // Agar cookie mein refresh token nahi hai
    if (!refreshToken) {
      return res.status(401).json({
        status: false,
        message: "Refresh Token is required",
      });
    }

    // --------------------------------------------------
    // 2. Refresh Token Verify + Decode
    // --------------------------------------------------
    // Token valid hai ya nahi check hoga
    // Aur token ke andar ka payload milega
    const decoded = readRefreshToken(refreshToken);

    // --------------------------------------------------
    // 3. Decoded token se userId aur role nikalna
    // --------------------------------------------------
    const { userId, role } = decoded;

    // --------------------------------------------------
    // 4. userId se MongoDB mein user find karna
    // --------------------------------------------------
    const user = await userModel.findById(userId);
   
    // Agar user database mein nahi mila
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "User not found",
      });
    }

    // --------------------------------------------------
    // 5. Refresh Token Mismatch Check
    // --------------------------------------------------
    // Browser ka refresh token
    // Database mein saved refresh token ke
    // same hona chahiye
    if (refreshToken !== user.refreshToken) {
      // Agar token match nahi karta,
      // database wala refresh token clear kar do
      await userModel.findByIdAndUpdate(user._id, {
        refreshToken: null,
      });

      return res.status(401).json({
        status: false,
        message: "Refresh Token mismatch",
      });
    }

    // --------------------------------------------------
    // 6. New Access Token Generate karna
    // --------------------------------------------------
    // userId aur role ko JWT payload mein
    // daal kar new access token create kar rahe hain
    const accessToken = createAccessToken({
      userId,
      role,
    });

    // --------------------------------------------------
    // 7. New Refresh Token Generate karna
    // --------------------------------------------------
    // Refresh Token Rotation:
    // purane refresh token ki jagah
    // new refresh token create karna
    const newRefreshToken = createRefreshToken({
      userId,
      role,
    });

    // --------------------------------------------------
    // 8. New Refresh Token Database mein save karna
    // --------------------------------------------------
    // Old refresh token ko replace karke
    // new refresh token save kar rahe hain
    await userModel.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    });

    // --------------------------------------------------
    // 9. New Refresh Token browser cookie mein save karna
    // --------------------------------------------------
    // Browser ko new refresh token dena zaroori hai
    // kyunki old token ab replace ho chuka hai
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
    });

    // --------------------------------------------------
    // 10. Response send karna
    // --------------------------------------------------
    // Frontend ko new access token milega
    return res.status(200).json({
      status: true,
      message: "Token rotated successfully",
      data: {
        user: {
          email: user.email,
          name: user.name,
          id: user._id,
        },
        accessToken,
      },
    });
  } catch (error) {
    // --------------------------------------------------
    // 11. Agar refresh token invalid/expired hai
    // --------------------------------------------------
    console.error("Refresh Token Error:", error);

    return res.status(401).json({
      status: false,
      message: "Invalid or expired refresh token",
    });
  }
};

//get me
const getmeController = async (req, res) => {
  try {
    const { userId, role } = req.user;
    const user = await userModel.findById(userId);
    res.status(200).json({
      message: "User data fetched successfully",
      data: {
        email: user.email,
        name: user.name,
        id: user._id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to get me",
    });
  }
};

export { registerController, loginController, refreshToken, getmeController };
