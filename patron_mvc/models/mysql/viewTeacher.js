import { connection } from '../../config/db.js';

export class ViewTeacherModel {
    static async getAll({ teacher,lastname }) {
        let viewTe = `SELECT I.id_inscripcion,
       M.nombre as asignatura,
       M.num_creditos,
       P.nombre   AS nombre_profesor,
       P.apellido AS apellido_profesor,
       E.nombre   AS nombre_estudiante,
       E.apellido AS apellido_estudiante
       FROM   inscripciones I
       INNER JOIN materias M
               ON I.id_materia = M.id_materia
       INNER JOIN profesores P
               ON M.id_profesor = P.id_profesor
       INNER JOIN estudiantes E
               ON E.id_estudiante = I.id_estudiante 
        `;
        if (teacher && lastname) {
            const lowerCasesTeacher = teacher.toLowerCase();
            const lowerCasesLast = lastname.toLowerCase();
            viewTe = viewTe + "   WHERE LOWER(P.nombre) = ? AND  LOWER(P.apellido) = ? ;"    
            const [result] = await connection.query(viewTe, [lowerCasesTeacher,lowerCasesLast])  //desestructuro pq viene dos
            if (result.length === 0) return []
            return result;
        }
        const [result] = await connection.query(viewTe)  //desestructuro pq viene dos
        return result;
    }

}
