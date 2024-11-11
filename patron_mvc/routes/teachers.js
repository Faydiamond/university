import { Router } from 'express'

import { TeacherController } from '../controllers/teachers.js';

export const teacherRouter = Router();

teacherRouter.get('/', TeacherController.getAll);
teacherRouter.get('/:id', TeacherController.getById)
teacherRouter.post('/', TeacherController.create)
teacherRouter.patch('/:id', TeacherController.update)
teacherRouter.delete('/:id', TeacherController.delete)
