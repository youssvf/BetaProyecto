import Usuario from "../../usuarios/domain/Usuario";
import Reserva from "./Reserva";

export default interface ReservaRepository {
    realizarReserva(reserva: Reserva): Promise<void>;
    getReservasUsuario(email: string): Promise<Reserva[]>;
    confirmarReserva(idReserva: number, conductor: string): Promise<void>;
    cancelarReserva(id: number): Promise<void>;
    getHistorialReservasUsuario(email: string): Promise<Reserva[]>;
}
