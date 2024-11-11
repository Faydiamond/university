import { connection } from '../../config/db.js';

export class StudentModel {
    static async getAll({ correo }) {
        let students = `SELECT id_estudiante,nombre,apellido,direccion,correo_electronico,clave,fecha_nacimiento,id_programa,id_ciudad,fecha_creacion FROM estudiantes`
        if (correo) {
            const lowerCasestudent = correo.toLowerCase()
            students = students + "   WHERE LOWER(correo_electronico) = ?;"
            const [result] = await connection.query(students, [lowerCasestudent])  //desestructuro pq viene dos
            if (result.length === 0) return []
            return result;
        }
        const [result] = await connection.query(students)  //desestructuro pq viene dos
        return result;
    }

    static async getById({ id }) {
        if (id) {
            const student = `SELECT id_estudiante,nombre,apellido,direccion,correo_electronico,clave,fecha_nacimiento,id_programa,id_ciudad,fecha_creacion FROM estudiantes
                where id_estudiante = ?;`
            const [result] = await connection.query(student, [id])  //desestructuro pq viene dos
            if (result.length === 0) return null
            return result;
        }
    }

    static async create({ input }) {
        const {
            nombre,
            apellido,
            direccion,
            correo_electronico,
            clave,
            fecha_nacimiento,
            id_programa,
            id_ciudad
        } = input
        try {
            const existeUsuario = await this.getAll({ correo: correo_electronico });
            if (existeUsuario.length > 0) {
                return {
                    error: 'El usuario ya existe'
                };
            }
            const insStudent = `CALL sp_InsertarEstudiante('${nombre}','${apellido}','${direccion}','${correo_electronico}','${clave}','${fecha_nacimiento}',${id_programa},${id_ciudad}); `;
            try {
                const res = await connection.query(insStudent);
            } catch (error) {
                console.error('Error al crear el usuario:', error);
                return { error: 'Ocurrió un error al crear el usuario' };
            }
        } catch (e) {
            throw new Error('Error al crear el  studiante' + e);
        }
        const [students] = await connection.query(
            `SELECT id_estudiante,nombre,apellido,direccion,correo_electronico,clave,fecha_nacimiento,id_programa,id_ciudad,fecha_creacion FROM estudiantes
                        where correo_electronico = ?`,
            [correo_electronico]
        )
        return students
    }

    static async update({ id, input }) {
        try {
            const Upt = `UPDATE estudiantes
            SET
            nombre = '${input.nombre}',
            apellido = '${input.apellido}',
            direccion ='${input.direccion}',
            correo_electronico = '${input.correo_electronico}',
            clave = '${input.clave}',
            fecha_nacimiento = '${input.fecha_nacimiento}',
            id_programa = ${input.id_programa},
            id_ciudad = ${input.id_programa}
            WHERE id_estudiante =?;` 
            const uptMovie = await connection.query(Upt,[id])
            if (uptMovie) {
               ///llamar gert by ud
               const updatedStudent = await this.getById({ id });
               return  updatedStudent;
            }
        } catch (error) {
            console.log(`Error al acturalizar el estudiante` + error.message);
        }
    }

    static async delete ({ id }) {
        try {
            const existStudent = await this.getById({ id });
            if(existStudent) {
                const removeMovie = await connection.query(`DELETE FROM estudiantes WHERE  id_estudiante =? `,[id])
            }
        } catch (error) {
            console.log(`Error al eliminar el estudiante`);
        }
    }
}
