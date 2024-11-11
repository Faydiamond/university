import { connection } from '../../config/db.js';

export class teacherModel {
    static async getAll({ correo }) {
        let teachers = `SELECT id_profesor,nombre,apellido,fecha_nacimiento,clave,id_ciudad,correo FROM profesores`
        if (correo) {
            const lowerCasestudent = correo.toLowerCase()
            teachers = teachers + "   WHERE LOWER(correo) = ?;"  
            const [result] = await connection.query(teachers, [lowerCasestudent])  //desestructuro pq viene dos
            if (result.length === 0) return []
            return result;
        }
        const [result] = await connection.query(teachers)  //desestructuro pq viene dos
        return result;
    }

    static async getById({ id }) {
        if (id) {
            const teacher = `SELECT id_profesor,nombre,apellido,fecha_nacimiento,clave,id_ciudad,correo FROM profesores WHERE id_profesor = ?;`
            const [result] = await connection.query(teacher, [id])  //desestructuro pq viene dos
            if (result.length === 0) return null
            return result;
        }
    }

    static async create({ input }) {
        const {
            nombre,
            apellido,
            fecha_nacimiento,
            correo,
            clave,
            id_ciudad
        } = input
        try {
            const existeTeacher = await this.getAll({ correo: correo });
            if (existeTeacher.length > 0) return {error: 'El profesor ya existe'}
            const insTeacher = `CALL sp_InsertarProfesor('${nombre}','${apellido}','${fecha_nacimiento}','${clave}',${id_ciudad},'${correo}'); `;
            try {
                const res = await connection.query(insTeacher);   
            } catch (error) {
                return { error: 'Ocurrió un error al crear el profesor' };
            }
        } catch (e) {
            throw new Error('Error al crear el  profesor' + e);
        }
        const [teachers] = await this.getAll({correo:correo})
        return teachers
    }

    static async update({ id, input }) {
        try {
            const existTeacher = await this.getById({ id });
            if (existTeacher === null) return { error: 'El profesor no existe' }
            const Upt = `UPDATE profesores SET nombre='${input.nombre}',apellido='${input.apellido}',
            fecha_nacimiento='${input.fecha_nacimiento}',clave='${input.clave}', id_ciudad='${input.id_ciudad}',
            correo='${input.correo}' WHERE id_profesor = ?;`
            const uptTeacher = await connection.query(Upt, [id])
            if (uptTeacher) {
                const [uptTeacher] = await this.getById({ id });
                return uptTeacher;
            }
        } catch (error) {
            console.log(`Error al acturalizar el teacher` + error.message);
        }
    }

    static async delete ({ id }) {
        try {
            const existTeacher= await this.getById({ id });
            if(existTeacher) {
                const removeTeacher = await connection.query(`DELETE FROM profesores WHERE  id_profesor =? `,[id])
            }else{
                return {
                    error: 'El profesor no existe'
                };
            }
        } catch (error) {
            console.log(`Error al eliminar el profesor`);
        }
    }
   
}
