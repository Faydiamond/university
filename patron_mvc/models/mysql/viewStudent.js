import { connection } from '../../config/db.js';

export class ViewTeacherModel {
    static async getAll({ id }) {
        if (id) {
            let [result] = await connection.query(`call sp_InfoEstudiante(${id})`)  
            return result;
        }
    }

    static async studentMAteria({ idStudent }) {
        if (idStudent) {
            let result = await connection.query(`SELECT 
                CONCAT(E2.nombre, ' ', E2.apellido) AS estudiantes,
                CONCAT(P.nombre, ' ', P.apellido) AS profesor,
                M.nombre AS materia
            FROM
                inscripciones I1
            INNER JOIN inscripciones I2 ON I1.id_materia = I2.id_materia
            INNER JOIN materias M ON I1.id_materia = M.id_materia
            INNER JOIN profesores P ON M.id_profesor = P.id_profesor
            INNER JOIN estudiantes E1 ON I1.id_estudiante = E1.id_estudiante
            INNER JOIN estudiantes E2 ON I2.id_estudiante = E2.id_estudiante
            WHERE
                E1.id_estudiante = ?;  `, [idStudent])  
           
            if (result.length === 0) return null
            return result;
        }
    }



}
