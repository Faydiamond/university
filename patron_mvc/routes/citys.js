import { Router } from 'express'

import { CityController } from '../controllers/citys.js';

export const cityRouter = Router()

cityRouter.get('/', CityController.getAll)
cityRouter.get('/:id', CityController.getById)
cityRouter.post('/', CityController.create)
cityRouter.patch('/:id', CityController.update)
cityRouter.delete('/:id', CityController.delete)
