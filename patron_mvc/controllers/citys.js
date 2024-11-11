
import { CityModel } from '../models/mysql/citys.js';

import { validateCity, validatePartialCity } from '../schemas/citys.js';

export class CityController {
  static async getAll (req, res) {
    const { city } = req.query
    const citys = await CityModel.getAll({ city })
    res.json(citys)
  }

  static async getById (req, res) {
    const { id } = req.params
    const city= await CityModel.getById({ id })
    if (city) return res.json(city)
    res.status(404).json({ message: 'city not found' })
  }

  static async create (req, res) {
    const result = validateCity(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const newMovie = await CityModel.create({ input: result.data })
    res.status(201).json(newMovie)
  }

  static async update (req, res) {
    const result = validatePartialCity(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const { id } = req.params
    const updateCity = await CityModel.update({ id, input: result.data })
    return res.json(updateCity)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await CityModel.delete({ id });
    if (result===undefined) return res.status(200).json({ message: 'Ciudad eliminada' });
    return res.status(404).json({ message: result.error});
  }
  
}
