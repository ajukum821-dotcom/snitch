import { body } from "express-validator";

export const createProductValidator = [
  body("title")
    .exists()
    .withMessage("Title is required")
    .bail()
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title length must be between 2 and 100 characters"),

  body("description")
    .exists()
    .withMessage("Description is required")
    .bail()
    .isString()
    .withMessage("Description must be a string")
    .bail()
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage(
      "Description length must be between 20 and 500 characters",
    ),

  body("price.amount")
    .exists()
    .withMessage("Price amount is required")
    .bail()
    .isFloat({ min: 0.01 })
    .withMessage("Price amount must be a number greater than 0"),

  body("price.currency")
    .exists()
    .withMessage("Currency is required")
    .bail()
    .isString()
    .withMessage("Currency must be a string value")
    .bail()
    .isIn(["INR", "USD"])
    .withMessage("Currency must be either INR or USD"),
];