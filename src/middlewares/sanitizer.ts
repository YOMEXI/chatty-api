import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import * as yup from "yup";

// export const policy = (schema) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const { error } = schema.validate(req.body, { abortEarly: false });

//     if (error) {
//       let err = error.details.map((e) => e.message).join(" ");

//       return res.json(err);
//     }
//     next();
//   };
// };

// export const schemas = {
//   User: Joi.object({
//     username: Joi.string().min(2).max(30).required(),
//     email: Joi.string().email().min(2).max(20).required(),
//     password: Joi.string().min(2).max(30).required(),
//     age: Joi.number().required(),
//   }),
// };

export const userData = yup.object({
  body: yup.object({
    age: yup.number().required(),
    password: yup.string().min(7).max(32).required(),
    username: yup.string().min(2).max(25).required(),
    email: yup.string().email().required(),
  }),
  // params: yup.object({
  //   id: yup.number().required(),
  // }),
});

export const userLogin = yup.object({
  body: yup.object({
    password: yup.string().min(7).max(32).required(),

    email: yup.string().email().required(),
  }),
  // params: yup.object({
  //   id: yup.number().required(),
  // }),
});

export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};
