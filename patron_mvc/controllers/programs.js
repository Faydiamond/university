
import { ProgramsModel } from '../models/mysql/programs.js';

import { validateProgram,validatePartialProgram } from '../schemas/programs.js';

export class ProgramsController {
  static async getAll (req, res) {
    const { program } = req.query
    const programs = await ProgramsModel.getAll({ program })
    res.json(programs)
  }

  static async getById (req, res) {
    const { id } = req.params
    const [program] = await ProgramsModel.getById({ id })
    if (program) return res.json(program)
    res.status(404).json({ message: 'El programa no existe' })
  }

  static async create (req, res) {
    
    const result = validateProgram(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const newProgram = await ProgramsModel.create({ input: result.data })
    res.status(201).json(newProgram)
  }
/*
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
*/  
}
