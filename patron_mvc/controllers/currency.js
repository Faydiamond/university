import axios from 'axios';

export class CurrencyController {
    static async convertUsdToEur(cantidadUsd) {
        try {
            if (cantidadUsd <= 0) {
                return Promise.reject(new Error('Ingrese un numero positivo'));
            }
            const response = await axios.get('https://api.frankfurter.app/latest?amount=' + cantidadUsd + '&from=USD&to=EUR');
            const  euros= response.data.rates.EUR;
            return euros;
        } catch (error) {
            console.error('Error al convertir divisa:', error.message);
            throw new Error('Error al obtener la tasa de cambio');
        }
    }
}
