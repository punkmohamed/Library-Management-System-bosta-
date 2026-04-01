import { body, param } from "express-validator";

export const addAuthorValidation = [
  body("name")
    .notEmpty()
    .withMessage("Author name is required")
    .isString()
    .withMessage("Author name must be a string")
    .isLength({ min: 2, max: 100 })
    .withMessage("Author name must be between 2 and 100 characters")
    .trim(),
  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .trim(),
];

export const updateAuthorValidation = [
  param("id").isUUID().withMessage("Invalid Author ID format"),
  body("name")
    .optional()
    .isString()
    .withMessage("Author name must be a string")
    .isLength({ min: 2, max: 100 })
    .withMessage("Author name must be between 2 and 100 characters")
    .trim(),
  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .trim(),
];

export const deleteAuthorValidation = [
  param("id").isUUID().withMessage("Invalid Author ID format"),
];

export const getAuthorValidation = [
  param("id").isUUID().withMessage("Invalid Author ID format"),
];
