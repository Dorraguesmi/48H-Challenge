import { Request, Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { Employee, validateCreateEmployee, validateUpdateEmployee } from '../models/employee'; // Adjust path based on your project structure

const router = Router();

// Get All Employees
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const employees = await Employee.find();
    res.status(200).json(employees);
  })
);

// Add a New Employee
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { error } = validateCreateEmployee(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  })
);

// Get Employee by ID
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  })
);

// Update an Employee
router.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { error } = validateUpdateEmployee(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(updatedEmployee);
  })
);

// Delete an Employee
router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Employee has been deleted successfully' });
  })
);

export default router;
