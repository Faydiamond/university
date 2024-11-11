import { Router } from 'express'

import { ViewStudentController } from '../controllers/viewStudent.js';

export const  ViewStudentRouter = Router();

ViewStudentRouter.get('/:id', ViewStudentController.getAll);
ViewStudentRouter.get('/', ViewStudentController.studentsMateria);