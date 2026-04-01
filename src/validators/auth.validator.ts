import { body } from "express-validator";

export const registerValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .toLowerCase()
    .trim(),
  body("full_name")
    .notEmpty()
    .withMessage("Full name is required")
    .isString()
    .withMessage("Full name must be a string")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];

export const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .toLowerCase()
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const refreshTokenValidation = [
  body("refresh_token")
    .notEmpty()
    .withMessage("Refresh token is required"),
];
