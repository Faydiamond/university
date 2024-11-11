
import { teacherModel } from '../models/mysql/teachers.js';

import { validateTeacher, validatePartialTeacher } from '../schemas/teachers.js';

export class TeacherController {
  static async getAll (req, res) {
    const { correo } = req.query;
    const teachers = await teacherModel.getAll({ correo });
    res.json(teachers);
  }

  static async getById (req, res) {
    const { id } = req.params
    const [teacher] = await teacherModel.getById({ id })
    if (teacher) return res.json(teacher)
    res.status(404).json({ message: 'teacher  not found' })
  }

  static async create (req, res) {
    const result = validateTeacher(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const newTeacher = await teacherModel.create({ input: result.data })
    res.status(201).json(newTeacher)
  }

  static async update (req, res) {
    const result = validatePartialTeacher(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const { id } = req.params
    const updatedTeacher = await teacherModel.update({ id, input: result.data })
    return res.json(updatedTeacher)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await teacherModel.delete({ id })
    if (result===undefined) return res.status(200).json({ message: 'Profesor eliminado' })
    return res.status(404).json({ message: result.error})
    
  }
    
}
