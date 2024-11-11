import { Router } from 'express'

import { InscriptionController } from '../controllers/inscriptions.js';

export const inscriptionRouter = Router()

inscriptionRouter.get('/', InscriptionController.getAll);
inscriptionRouter.get('/:id', InscriptionController.getById);
inscriptionRouter.post('/', InscriptionController.create);
inscriptionRouter.patch('/:id', InscriptionController.update);
inscriptionRouter.delete('/:id', InscriptionController.delete);