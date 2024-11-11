import { Router } from 'express';

import { MateriaController } from '../controllers/materias.js';

export const materiaRouter = Router();

materiaRouter.get('/', MateriaController.getAll);
materiaRouter.get('/:id', MateriaController.getById);
materiaRouter.post('/', MateriaController.create);
materiaRouter.patch('/:id', MateriaController.update);
materiaRouter.delete('/:id', MateriaController.delete);