import e, { json } from 'express';
import { connection } from '../../config/db.js';

export class InscriptionModel {
    static async getAll() {
        let inscription = `SELECT I.id_inscripcion,
       M.nombre,
       M.num_creditos,
       M.costo_credito,
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
               ON E.id_estudiante = I.id_estudiante `
        
        const result = await connection.query(inscription)
        return result;
    }

    static async getById({ id }) {
        if (id) {
            const inscription = `SELECT I.id_inscripcion,
            M.nombre,
            M.num_creditos,
            M.costo_credito,
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
                    
            WHERE id_inscripcion = ?;`
            const [result] = await connection.query(inscription, [id])  //desestructuro pq viene dos
            if (result.length === 0) return null
            return result;
        }
    }

    static async getInscriptionStudent(idStudent, idMateria) {
        let inscription = `SELECT I.id_inscripcion,
       M.nombre,
       M.num_creditos,
       M.costo_credito,
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
        WHERE E.id_estudiante= ? AND M.id_materia=?`
        

        const [result] = await connection.query(inscription, [idStudent, idMateria])
        return result;
    }

    static async createInscription({ input }) {
        try {
            // Query para insertar una nueva inscripción
            const { id_estudiante, id_materia } = input
            const [result] = await connection.query(`INSERT INTO inscripciones (id_estudiante, id_materia ) VALUES (${id_estudiante}, ${id_materia})`, [id_estudiante, id_materia]);
            if (result.affectedRows === 1) {
                const [inscript] = await this.getInscriptionStudent(id_estudiante, id_materia);
                 return inscript
            }
        } catch (error ) {
            return {error: error.sqlMessage}
        }
    }

    static async update({ id, input }) {
        try {
            const existInscription = await this.getById({ id });
            if (existInscription === null) return { error: 'La inscripcion no existe' }
            const Upt = `UPDATE inscripciones SET id_estudiante = ${input.id_estudiante},id_materia = ${input.id_materia} WHERE id_inscripcion = ?;`
            const uptInscription = await connection.query(Upt, [id])
            if (uptInscription) {
                const updatedStudent = await this.getById({ id });
                return updatedStudent;
            }
        } catch (error) {
            console.log(`Error al acturalizar el estudiante` + error.message);
        }
    }

    static async delete({ id }) {
        try {
            const existInscription = await this.getById({ id });
            if (existInscription === null) {
                return {
                    error: 'La inscripcion no existe'
                };

            } else {
                const deleteInscription = await connection.query(`DELETE FROM inscripciones WHERE id_inscripcion =? `, [id])
            }
        } catch (error) {
            console.log(`Error al eliminar la inscripcion`);
        }
    }


}
