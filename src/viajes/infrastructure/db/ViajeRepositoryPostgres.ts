import Viaje from "../../domain/Viaje";
import ViajeRepository from "../../domain/ViajeRepository";
import executeQuery from "../../../context/db/PostgresConnector";
import Usuario from "../../../usuarios/domain/Usuario";

export default class ViajeRepositoryPostgres implements ViajeRepository {

    async getAll(): Promise<Viaje[]> {
        const query = `
            SELECT * FROM Viajes
        `;
    
        const viajesDB: any[] = await executeQuery(query);
        const viajes: Viaje[] = [];
    
        for (const item of viajesDB) {
            const viaje: Viaje = {
                id: item.id,
                conductor: item.conductor,
                origen: item.origen,
                destino: item.destino,
                fechasalida: item.fechasalida,
                asientosdisponibles: item.asientosdisponibles,
                precio: item.precio,
                descripcion: item.descripcion
            };
    
            viajes.push(viaje);
        }
    
        return viajes;
    }
    
    
    async crearViaje(viaje: Viaje, usuario:Usuario): Promise<void> {
        const query = `
            INSERT INTO Viajes(
                conductor,
                origen,
                destino,
                fechasalida,
                asientosdisponibles,
                precio,
                descripcion
            )
            VALUES (
                '${usuario.email}',
                '${viaje.origen}',
                '${viaje.destino}',
                '${viaje.fechasalida}',
                ${viaje.asientosdisponibles},
                ${viaje.precio},
                '${viaje.descripcion}'
            )`;
        await executeQuery(query);
    }

    async getViaje(idViaje: number): Promise<Viaje | undefined> {
        const query = `SELECT * FROM Viajes WHERE id = ${idViaje}`;
        const rows: any[] = await executeQuery(query);

        if (rows.length === 0) {
            return undefined;
        }

        const viaje: Viaje = {
            id: rows[0].id,
            conductor: rows[0].conductor,
            origen: rows[0].origen,
            destino: rows[0].destino,
            fechasalida: rows[0].fechasalida,
            asientosdisponibles: rows[0].asientosdisponibles,
            precio: rows[0].precio,
            descripcion: rows[0].descripcion
        };

        return viaje;
    }

    async getViajes(origen: string, destino: string, fecha: string): Promise<Viaje[]> {
        const query = `
            SELECT * FROM Viajes
            WHERE origen = '${origen}'
            AND destino = '${destino}'
            AND fechasalida > '${fecha}'
            AND asientosdisponibles > 0
        `;

        const viajesDB: any[] = await executeQuery(query);
        const viajes: Viaje[] = [];

        for (const item of viajesDB) {
            const viaje: Viaje = {
                id: item.id,
                conductor: item.conductor,
                origen: item.origen,
                destino: item.destino,
                fechasalida: item.fechasalida,
                asientosdisponibles: item.asientosdisponibles,
                precio: item.precio,
                descripcion: item.descripcion
            };

            viajes.push(viaje);
        }

        return viajes;
    }

    async actualizarViaje(idViaje: number, detallesActualizados: Viaje): Promise<void> {
        const query = `
            UPDATE Viajes
            SET
                origen = '${detallesActualizados.origen}',
                destino = '${detallesActualizados.destino}',
                fechasalida = '${detallesActualizados.fechasalida}',
                asientosdisponibles = ${detallesActualizados.asientosdisponibles},
                precio = ${detallesActualizados.precio},
                descripcion = '${detallesActualizados.descripcion}'
            WHERE id = ${idViaje}
        `;

        await executeQuery(query);
    }

    async eliminarViaje(idViaje: number): Promise<void> {
        const query = `DELETE FROM Viajes WHERE id = ${idViaje}`;
        await executeQuery(query);
    }
}
