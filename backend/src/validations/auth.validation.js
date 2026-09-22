import { body, validationResult } from "express-validator";

export const registerValidation = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .bail()

    .trim()

    .isString()
    .withMessage("Email must be a string")
    .bail()

    .isEmail()
    .withMessage("Please enter a valid email address")
    .bail()

    .normalizeEmail(),

  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .trim()
    .isString()
    .withMessage("Name must be String")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("password")
    .exists()
    .withMessage("Name must Required")
    .bail()
    .isString()
    .withMessage("Password must be String")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        errors: errors.array(),
      });
    }
    next();
  },
];

//LOgin validation

export const loginValidation = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .bail()
    .trim()
    .isString()
    .withMessage("Email must be string")
    .bail()
    .isEmail()
    .withMessage("Enter valid email address")
    .bail()
    .normalizeEmail(),
  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .isString()
    .withMessage("Password must be String"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        errors: errors.array(),
      });
    }
    next();
  },
];
