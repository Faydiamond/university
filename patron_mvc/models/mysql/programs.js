import { connection } from '../../config/db.js';

export class ProgramsModel {
    static async getAll({ program }) {
        
        let programs = `SELECT id_programa,nombre FROM programas`;
        if (program) {
            const lowerCasestudent = program.toLowerCase()
            programs = programs + "   WHERE LOWER(nombre) = ?;"
            console.log(" programs  ", programs);
            
            const [result] = await connection.query(programs, [lowerCasestudent])  //desestructuro pq viene dos
            if (result.length === 0) return []
            return result;
        }
        const [result] = await connection.query(programs)  //desestructuro pq viene dos
        return result;
    }

    static async getById({ id }) {
        if (id) {
            const program = `SELECT id_programa,nombre FROM programas WHERE id_programa=?;`
            const [result] = await connection.query(program, [id])  //desestructuro pq viene dos
            if (result.length === 0) return null
            return result;
        }
    }

    static async create({ input }) {
        const { program } = input;
        try {
          const existingProgram = await this.getAll({ program });
          if (existingProgram.length > 0) {
            return { error: 'El programa ya existe' };
          }
          const [result] = await connection.query(`CALL sp_InsertarPrograma(?)`, [program]);
          const [newProgram] = await connection.query(`SELECT id_programa, nombre FROM programas WHERE nombre = ?`,[program]);
          return newProgram[0];
        } catch (error) {
          console.error('Error creating program:', error);
          return { error: 'Error al crear el programa' };
        }
      }
/*
    static async update({ id, input }) {
        try {
            const existInscription = await this.getById({ id });
            if (existInscription === null) return { error: 'La ciudad no existe' }
            const Upt = `UPDATE ciudades SET ciudad='${input.ciudad}' WHERE id_ciudad = ?;`
            const uptCity = await connection.query(Upt, [id])
            if (uptCity) {
                const [updatedCity] = await this.getById({ id });
                console.log("Update city . " ,updatedCity ); 
                return updatedCity;
            }
        } catch (error) {
            console.log(`Error al acturalizar el estudiante` + error.message);
        }
    }

    static async delete ({ id }) {
        try {
            const existCity= await this.getById({ id });
            if(existCity) {
                const removeCity = await connection.query(`DELETE FROM ciudades WHERE  id_ciudad =? `,[id])
            }else{
                return {
                    error: 'LA ciudad  no existe'
                };
            }
        } catch (error) {
            console.log(`Error al eliminar la ciudad`);
        }
    }
        */
}
