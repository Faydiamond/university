
import { StudentModel } from '../models/mysql/student.js'

import { validateStudent, validatePartialStudent } from '../schemas/Student.js'

export class StudentController {
  static async getAll (req, res) {
    const { correo } = req.query
    const students = await StudentModel.getAll({ correo })
    res.json(students)
  }

  static async getById (req, res) {
    const { id } = req.params
    const [student] = await StudentModel.getById({ id })
    
    if (student) return res.json(student)
    res.status(404).json({ message: 'student not found' })
  }

  static async create (req, res) {
    const result = validateStudent(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const newStu = await StudentModel.create({ input: result.data })
    res.status(201).json(newStu)
  }


  //
  static async update (req, res) {
    const result = validatePartialStudent(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const { id } = req.params
    const updatedMovie = await StudentModel.update({ id, input: result.data })
    return res.json(updatedMovie)
   
  }

  static async delete (req, res) {
    const { id } = req.params
    
    const result = await StudentModel.delete({ id })
    if (result === false) {
      return res.status(404).json({ message: 'El etudiante no existe en la bd' })
    }
    return res.json({ message: 'student deleted' });
  }
}
