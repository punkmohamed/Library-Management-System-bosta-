import { body, param } from "express-validator";

export const updateUserValidation = [
  param("id").isUUID().withMessage("Invalid User ID format"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .toLowerCase()
    .trim(),
  body("full_name")
    .optional()
    .isString()
    .withMessage("Full name must be a string")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .trim(),
];

export const deleteUserValidation = [
  param("id").isUUID().withMessage("Invalid User ID format"),
];
