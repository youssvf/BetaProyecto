import Reserva from '../domain/Reserva';
import ReservaRepository from '../domain/ReservaRepository';
import Usuario from '../../usuarios/domain/Usuario';

export default class ReservaUseCases {
    reservaRepository: ReservaRepository;

    constructor(reservaRepository: ReservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    async realizarReserva(reserva: Reserva): Promise<void> {
        await this.reservaRepository.realizarReserva(reserva);
    }

    async getReservasUsuario(email: string): Promise<Reserva[]> {
        return this.reservaRepository.getReservasUsuario(email);
    }

    async confirmarReserva(idReserva: number, conductor: string): Promise<void> {
        await this.reservaRepository.confirmarReserva(idReserva, conductor);
    }

    async cancelarReserva(idReserva: number): Promise<void> {
        await this.reservaRepository.cancelarReserva(idReserva);
    }

    async getHistorialReservasUsuario(email: string): Promise<Reserva[]> {
        return this.reservaRepository.getHistorialReservasUsuario(email);
    }
}
