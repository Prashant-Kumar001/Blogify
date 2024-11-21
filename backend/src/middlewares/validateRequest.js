import Joi from 'joi';
import asyncHandler from 'express-async-handler';

// Register Validation
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Login Validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Blog Validation
const BlogSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Title should be a type of string',
      'string.min': 'Title should have at least 3 characters',
      'string.max': 'Title should have at most 100 characters',
      'any.required': 'Title is required',
    }),

  description: Joi.string()
    .min(10)
    .required()
    .messages({
      'string.base': 'Description should be a type of string',
      'string.min': 'Description should have at least 10 characters',
      'any.required': 'Description is required',
    }),
});


export const validateRegister = asyncHandler(async (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }
  next();
});

export const validateLogin = asyncHandler(async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }
  next();
});

export const validateBlog = asyncHandler(async (req, res, next) => {
  const { error } = BlogSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }
  next();
});
