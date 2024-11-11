import { Router } from 'express'

import { StudentController } from '../controllers/student.js'

export const studentRouter = Router()

studentRouter.get('/', StudentController.getAll)
studentRouter.get('/:id', StudentController.getById)
studentRouter.post('/', StudentController.create)
studentRouter.patch('/:id', StudentController.update)
studentRouter.delete('/:id', StudentController.delete)