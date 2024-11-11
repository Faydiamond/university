import { Router } from 'express';
import { ProgramsController } from '../controllers/programs.js';

export const programRouter = Router()

programRouter.get('/', ProgramsController.getAll);
programRouter.get('/:id', ProgramsController.getById);
programRouter.post('/', ProgramsController.create);/*
programRouter.patch('/:id', ProgramsController.update);
programRouter.delete('/:id', ProgramsController.delete)*/