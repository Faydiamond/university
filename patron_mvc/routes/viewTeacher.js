import { Router } from 'express'

import { ViewTeacherController } from '../controllers/viewTeacher.js';

export const  ViewTeacherRouter = Router();

ViewTeacherRouter.get('/', ViewTeacherController.getAll);