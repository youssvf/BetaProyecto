import executeQuery from "../../../context/db/PostgresConnector";
import ViajeRepository from "../../../viajes/domain/ViajeRepository";
import Reserva from "../../domain/Reserva";
import ReservaRepository from "../../domain/ReservaRepository";

export default class ReservaRepositoryPostgres implements ReservaRepository {
  private viajesRepository: ViajeRepository;

  constructor(viajesRepository: ViajeRepository) {
    this.viajesRepository = viajesRepository;
  }


  async realizarReserva(reserva: Reserva): Promise<void> {
    const query = `
            INSERT INTO Reservas(viaje, pasajero, asientosreservados, estadoreserva)
            VALUES (${reserva.viaje}, '${reserva.userEmail}', ${reserva.asientosreservados}, 'pendiente')
        `;
    await executeQuery(query);
  }

  async getReservasUsuario(email: string): Promise<Reserva[]> {
    const query = `SELECT * FROM Reservas WHERE pasajero = '${email}' AND estadoreserva = 'pendiente'`;
    const reservasDB: any[] = await executeQuery(query);

    const reservas: Reserva[] = reservasDB.map((item) => ({
      id: item.id,
      viaje: item.viaje,
      pasajero: item.pasajero,
      asientosreservados: item.asientosreservados,
      estadoreserva: item.estadoreserva,
    }));

    return reservas;
  }

  async confirmarReserva(idReserva: number, conductor: string): Promise<void> {
    const reserva: Reserva | undefined = await this.getReservaById(idReserva);
    const viaje = await this.viajesRepository.getViaje(Number(reserva?.viaje))

    if (reserva) {
      if(conductor !== String(viaje?.conductor)){
        throw new Error('No tienes permisos para confirmar esta reserva');
      } else {
        const queryConfirmar = `UPDATE Reservas SET estadoreserva = 'confirmada' WHERE id = ${idReserva}`;
      await executeQuery(queryConfirmar);

      await this.actualizarAsientosDisponibles(reserva.viaje,-reserva.asientosreservados);
      }
    }
  }

  async cancelarReserva(idReserva: number): Promise<void> {
    const reserva: Reserva | undefined = await this.getReservaById(idReserva);

    if (reserva) {
      const queryCancelar = `UPDATE Reservas SET estadoreserva = 'cancelada' WHERE id = ${idReserva}`;
      await executeQuery(queryCancelar);

      await this.actualizarAsientosDisponibles(reserva.viaje,reserva.asientosreservados);
    }
  }

  async getHistorialReservasUsuario(email: string): Promise<Reserva[]> {
    const query = `SELECT * FROM Reservas WHERE pasajero = '${email}'   `;
    const historialDB: any[] = await executeQuery(query);

    const historial: Reserva[] = historialDB.map((item) => ({
      id: item.id,
      viaje: item.viaje,
      pasajero: item.pasajero,
      asientosreservados: item.asientosreservados,
      estadoreserva: item.estadoreserva,
    }));

    return historial;
  }

  private async actualizarAsientosDisponibles(
    idViaje: number,
    cantidad: number
  ): Promise<void> {
    const queryActualizarAsientos = `UPDATE Viajes SET asientosdisponibles = asientosdisponibles + ${cantidad} WHERE id = ${idViaje}`;
    await executeQuery(queryActualizarAsientos);
  }

  private async getReservaById(
    idReserva: number
  ): Promise<Reserva | undefined> {
    const query = `SELECT * FROM Reservas WHERE id = ${idReserva}`;
    const rows: any[] = await executeQuery(query);

    if (rows.length === 0) {
      return undefined;
    }

    const reserva: Reserva = {
      id: rows[0].id,
      viaje: rows[0].viaje,
      pasajero: rows[0].pasajero,
      asientosreservados: rows[0].asientosreservados,
      estadoreserva: rows[0].estadoreserva,
    };

    return reserva;
  }
}
