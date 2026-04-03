import AppError from "../utils/AppError.js";

/**
 * Validates a request body against a set of rules.
 *
 * Usage in routes:
 *   router.post("/", protect, validate(createProjectRules), createProject);
 *
 * Rules format:
 *   { field: "name", message: "Name is required", validator: (v) => !!v }
 */
export const validate = (rules) => (req, res, next) => {
  const errors = [];

  for (const rule of rules) {
    const value = req.body[rule.field];
    if (!rule.validator(value, req.body)) {
      errors.push({ field: rule.field, message: rule.message });
    }
  }

  if (errors.length > 0) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// ─── Reusable helpers ──────────────────────────────────────────────────────────

const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
const isValidEmail = (v) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidRole = (v) => ["admin", "manager", "user"].includes(v);
const isPositiveInt = (v) => Number.isInteger(Number(v)) && Number(v) > 0;

// ─── Auth rules ────────────────────────────────────────────────────────────────

export const loginRules = [
  { field: "email", message: "Email is required and must be valid", validator: isValidEmail },
  { field: "password", message: "Password is required", validator: isNonEmptyString },
];

export const registerRules = [
  { field: "name", message: "Name is required", validator: isNonEmptyString },
  { field: "email", message: "Email is required and must be valid", validator: isValidEmail },
  {
    field: "password",
    message: "Password must be at least 6 characters",
    validator: (v) => typeof v === "string" && v.length >= 6,
  },
];

// ─── User rules ────────────────────────────────────────────────────────────────

export const createUserRules = [
  { field: "name", message: "Name is required", validator: isNonEmptyString },
  { field: "email", message: "Valid email is required", validator: isValidEmail },
  {
    field: "password",
    message: "Password must be at least 6 characters",
    validator: (v) => typeof v === "string" && v.length >= 6,
  },
  { field: "role", message: "Role must be admin, manager, or user", validator: isValidRole },
];

// ─── Project rules ─────────────────────────────────────────────────────────────

export const createProjectRules = [
  { field: "name", message: "Project name is required", validator: isNonEmptyString },
];

export const updateProjectRules = [
  {
    field: "name",
    message: "Project name must be a non-empty string if provided",
    validator: (v, body) => {
      if (body.name === undefined) return true; // optional
      return isNonEmptyString(v);
    },
  },
];

// ─── Task rules ────────────────────────────────────────────────────────────────

const VALID_STATUSES = ["todo", "in_progress", "done"];

export const createTaskRules = [
  { field: "title", message: "Task title is required", validator: isNonEmptyString },
  { field: "projectId", message: "projectId must be a positive integer", validator: isPositiveInt },
  {
    field: "status",
    message: `Status must be one of: ${VALID_STATUSES.join(", ")}`,
    validator: (v, body) => {
      if (!body.status) return true; // optional — defaults to "todo"
      return VALID_STATUSES.includes(v);
    },
  },
  {
    field: "dueDate",
    message: "dueDate must be a valid ISO date string",
    validator: (v, body) => {
      if (!body.dueDate) return true; // optional
      return !isNaN(Date.parse(v));
    },
  },
];

export const updateTaskStatusRules = [
  {
    field: "status",
    message: `Status must be one of: ${VALID_STATUSES.join(", ")}`,
    validator: (v) => VALID_STATUSES.includes(v),
  },
];

export const assignTaskRules = [
  {
    field: "assignedTo",
    message: "assignedTo must be a positive integer user ID",
    validator: isPositiveInt,
  },
];
