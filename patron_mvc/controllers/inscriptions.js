
import { InscriptionModel } from '../models/mysql/inscriptions.js'

import { validateInscription, validatePartialInscription } from '../schemas/inscriptions.js'

export class InscriptionController {
    static async getAll(req, res) {
        const [inscription] = await InscriptionModel.getAll()
        res.json(inscription)
    }

    static async getById(req, res) {
        const { id } = req.params
        const inscription = await InscriptionModel.getById({ id })
        if (inscription) return res.json(inscription[0])
        res.status(404).json({ message: 'inscription not found' })
    }

    static async create(req, res) {
        const result = validateInscription(req.body);

        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) });
        }
        const newInscription = await InscriptionModel.createInscription({ input: result.data });

        if (newInscription.error) {
            // Manejar errores específicos del modelo
            if (newInscription.error) {
                return res.status(409).json({ message: newInscription.error });
            }
        }

        return res.status(201).json(newInscription); // 201 Created

    }

    static async update(req, res) {
        const result = validatePartialInscription(req.body)
        if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) })
        const { id } = req.params
        const updateInscription = await InscriptionModel.update({ id, input: result.data })
        return res.json(updateInscription[0])
    }

    static async delete(req, res) {
        const { id } = req.params
        const result = await InscriptionModel.delete({ id })
        if (result === undefined) return res.status(200).json({ message: 'Inscripcion eliminada' })
        return res.status(404).json({ message: result.error })
    }

}



