import { ViewTeacherModel } from '../models/mysql/viewStudent.js';
import { CurrencyController } from '../controllers/currency.js';

export class ViewStudentController {
    static async getAll(req, res) {
        const { id } = req.params;
        const [students] = await ViewTeacherModel.getAll({ id });

        if (students[0]){
            try {
                const divisa = await CurrencyController.convertUsdToEur(students[0].costo_total_dolares);
                students[0].costo_total_dolares = parseFloat(students[0].costo_total_dolares);
                res.json({...students[0],"costo_total_euros":divisa});
            } catch (error) {
                console.error('Error en el controlador:', error.message);
                res.status(500).json({ error: 'Error al procesar la solicitud' });
            }
        }else{
            
            res.status(404).json({ message: 'No se tieneen registros en la base de datos' });
        } 
    }

    static async studentsMateria(req, res) {
        const { idStudent } = req.query;
        const materias = await ViewTeacherModel.studentMAteria({ idStudent })
        
        if (materias) return res.json(materias[0])
        res.status(404).json({ message: 'No se encontraron registros para el alumno.' })
    }

}