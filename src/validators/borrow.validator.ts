import { body, param, query } from "express-validator";

export const checkoutValidation = [
  body("user_id")
    .notEmpty()
    .withMessage("User ID is required")
    .isUUID()
    .withMessage("Invalid User ID format"),
  body("book_id")
    .notEmpty()
    .withMessage("Book ID is required")
    .isUUID()
    .withMessage("Invalid Book ID format"),
  body("due_date")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Invalid due date format (must be ISO8601 date string)")
    .toDate(),
];

export const returnValidation = [
  body("user_id")
    .notEmpty()
    .withMessage("User ID is required")
    .isUUID()
    .withMessage("Invalid User ID format"),
  body("book_id")
    .notEmpty()
    .withMessage("Book ID is required")
    .isUUID()
    .withMessage("Invalid Book ID format"),
];

export const checkCurrentBorrowingsValidation = [
  param("user_id").isUUID().withMessage("Invalid User ID format"),
];

export const listOverdueBooksValidation = [
  query("status")
    .optional()
    .isIn(["BORROWED", "OVERDUE", "RETURNED"])
    .withMessage("Invalid status value"),
];
