import { connection } from '../../config/db.js';

export class materiaModel {
    static async getAll({ nombre }) {
        let materias = `SELECT id_materia,nombre,num_creditos,costo_credito,id_profesor FROM materias`;
        if (nombre) {
            const lowerCasestudent = nombre.toLowerCase()
            materias = materias + "   WHERE LOWER(nombre) = ?;"
            const [result] = await connection.query(materias, [lowerCasestudent])  //desestructuro pq viene dos
            if (result.length === 0) return []
            return result;
        }
        const [result] = await connection.query(materias)  //desestructuro pq viene dos
        return result;
    }

    static async getById({ id }) {
        if (id) {
            const materia = `SELECT id_materia,nombre,num_creditos,costo_credito,id_profesor FROM materias WHERE id_materia = ?;`
            const [result] = await connection.query(materia, [id])  //desestructuro pq viene dos
            if (result.length === 0) return null
            return result;
        }
    }

    static async create({ input }) {
        try {
            const {
                nombre,
                num_creditos,
                costo_credito,
                id_profesor
            } = input

            const query = `CALL sp_InsertarMateria('${nombre}',${num_creditos},${costo_credito},${id_profesor}); `;
            const [result] = await connection.query(query);
            if (result.affectedRows === 1) {
                const [inscript] = await this.getAll({ nombre: nombre });
                if (inscript.id_materia >= 1) return inscript
            }
        } catch (error) {
            let e = error
            if (error.sqlMessage) e = e.sqlMessage
            return {
                message: e
            }
        }
    }

    static async update({ id, input }) {
        try {
            const existMateria = await this.getById({ id });
            if (existMateria === null) return { error: 'La materia no existe' }
            const Upt = `UPDATE materias SET nombre='${input.nombre}',num_creditos=${input.num_creditos},
            costo_credito=${input.costo_credito},id_profesor=${input.id_profesor} WHERE id_materia = ?;`
            const uptMaterial = await connection.query(Upt, [id])
            if (uptMaterial) {
                const [uptMaterial] = await this.getById({ id });
                console.log("Update material . ", uptMaterial);
                return uptMaterial;
            }
        } catch (error) {
            console.log(`Error al acturalizar la materia` + error.message);
        }
    }

    static async delete ({ id }) {
        try {
            const existMateria= await this.getById({ id });
            if(existMateria) {
                const removeMateria = await connection.query(`DELETE FROM materias WHERE id_materia =? `,[id])
            }else{
                return {
                    error: 'LA materia  no existe'
                };
            }
        } catch (error) {
            console.log(`Error al eliminar la materia`);
        }
    }
   
}
