import { body, query, param } from "express-validator";

export const addBookValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .trim(),
  body("author_id")
    .notEmpty()
    .withMessage("Author ID is required")
    .isUUID()
    .withMessage("Invalid Author ID format"),
  body("isbn")
    .notEmpty()
    .withMessage("ISBN is required")
    .isString()
    .withMessage("ISBN must be a string")
    .trim(),
  body("total_copies")
    .notEmpty()
    .withMessage("Total copies is required")
    .isInt({ min: 1 })
    .withMessage("Total copies must be an integer at least 1"),
  body("shelf_location")
    .notEmpty()
    .withMessage("Shelf location is required")
    .isString()
    .withMessage("Shelf location must be a string")
    .trim(),
];

export const updateBookValidation = [
  param("id").isUUID().withMessage("Invalid Book ID format"),
  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .trim(),
  body("author_id")
    .optional()
    .isUUID()
    .withMessage("Invalid Author ID format"),
  body("isbn")
    .optional()
    .isString()
    .withMessage("ISBN must be a string")
    .trim(),
  body("total_copies")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Total copies must be an integer at least 1"),
  body("shelf_location")
    .optional()
    .isString()
    .withMessage("Shelf location must be a string")
    .trim(),
];

export const listBooksValidation = [
  query("query")
    .optional()
    .isString()
    .withMessage("Search query must be a string")
    .trim(),
];

export const deleteBookValidation = [
  param("id").isUUID().withMessage("Invalid Book ID format"),
];

export const getBookValidation = [
  param("id").isUUID().withMessage("Invalid Book ID format"),
];
