
import { materiaModel } from '../models/mysql/materias.js';
import { validateMateria, validatePartialMateria } from '../schemas/materias.js';

export class MateriaController {
  static async getAll (req, res) {
    const { nombre } = req.query;
    const [materias] = await materiaModel.getAll({ nombre });
    res.json(materias);
  }

  static async getById (req, res) {
    const { id } = req.params
    const materia = await materiaModel.getById({ id })
    if (materia) return res.json(materia)
    res.status(404).json({ message: 'materia  not found' })
  }

  
  static async create (req, res) {
    const result = validateMateria(req.body)
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
    const newMateria= await materiaModel.create({ input: result.data })
    res.status(200).json(newMateria)
  }

  
  static async update (req, res) {
    const result = validatePartialMateria(req.body);
    if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
    const { id } = req.params;
    const updatedMaterial= await materiaModel.update({ id, input: result.data });
    return res.json(updatedMaterial);
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await materiaModel.delete({ id });
    if (result===undefined) return res.status(200).json({ message: 'Materia eliminada' });
    return res.status(404).json({ message: result.error});
        
  }
    
}
