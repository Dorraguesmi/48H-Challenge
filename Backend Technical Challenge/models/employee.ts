import mongoose, { Document, Schema } from 'mongoose';
import Joi from 'joi';

export interface IEmployee extends Document {
  name: string;
  email: string;
  position: string;
  department?: string;
  salary?: number;
}

const employeeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100
    },
    position: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    department: {
      type: String,
      trim: true,
      maxlength: 100
    },
    salary: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

export const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);

export const validateCreateEmployee = (obj: any) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().email().max(100).required(),
    position: Joi.string().trim().max(100).required(),
    department: Joi.string().trim().max(100),
    salary: Joi.number()
  });
  return schema.validate(obj);
};

export const validateUpdateEmployee = (obj: any) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100),
    email: Joi.string().trim().email().max(100),
    position: Joi.string().trim().max(100),
    department: Joi.string().trim().max(100),
    salary: Joi.number()
  });
  return schema.validate(obj);
};
