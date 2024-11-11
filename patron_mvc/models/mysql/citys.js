import { connection } from '../../config/db.js';

export class CityModel {
    static async getAll({ city }) {
        let citys = `SELECT id_ciudad,ciudad FROM ciudades`;
        if (city) {
            const lowerCasestudent = city.toLowerCase()
            citys = citys + `   WHERE LOWER(ciudad) = '${city}';`;
            const [result] = await connection.query(citys, [lowerCasestudent])  //desestructuro pq viene dos
            if (result.length === 0) return []
            return result;
        }
        const [result] = await connection.query(citys)  //desestructuro pq viene dos
        return result;
    }
    
    static async getById({ id }) {
        if (id) {
            
            const [result] = await connection.query(`SELECT id_ciudad,ciudad FROM ciudades WHERE id_ciudad=?`, [id])  //desestructuro pq viene dos
            if (result.length === 0) return null

            return result[0]
        }
    }

    static async create({ input }) {
        const { ciudad } = input;
      
        try {
          // Check if city already exists
          const existingCity = await this.getAll({ city: ciudad });
          if (existingCity.length > 0) {
            return { error: 'La ciudad ya existe' };
          }
      
          // Insert the new city
          const [result] = await connection.query(`CALL sp_InsertarCiudad(?)`, [ciudad]);
      
          // Retrieve the newly created city
          const [newCity] = await connection.query(
            `SELECT id_ciudad, ciudad FROM ciudades WHERE ciudad = ?`,
            [ciudad]
          );
      
          return newCity[0];
        } catch (error) {
          console.error('Error creating city:', error);
          throw new Error('Error al crear la ciudad'); // Re-throw the error to propagate it further
        }
      }

    static async update({ id, input }) {
        try {
            const existInscription = await this.getById({ id });
            if (existInscription === null) return { error: 'La ciudad no existe' }
            try {
                const Upt = `UPDATE ciudades SET ciudad='${input.ciudad}' WHERE id_ciudad = ?;`
                const uptCity = await connection.query(Upt, [id])
                if (uptCity) {
                    const updatedCity = await this.getById({ id });
                    console.log("Updatecity . " ,updatedCity ); 
                    return updatedCity;
                }
                } catch (error) {
                    console.log("What " ,error)
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
}
