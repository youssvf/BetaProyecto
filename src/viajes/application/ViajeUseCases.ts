import Usuario from "../../usuarios/domain/Usuario";
import Viaje from "../domain/Viaje";
import ViajeRepository from "../domain/ViajeRepository";

export default class ViajeUseCases {
    viajeRepository: ViajeRepository;

    constructor(viajeRepository: ViajeRepository) {
        this.viajeRepository = viajeRepository;
    }

    async getAll():Promise<Viaje[]>{
        return this.viajeRepository.getAll();
    }

    async crearViaje(viaje: Viaje, usuario: Usuario): Promise<void> {
        return this.viajeRepository.crearViaje(viaje,usuario);
    }

    async getViaje(idViaje: number): Promise<Viaje | undefined> {
        return this.viajeRepository.getViaje(idViaje);
    }

    async getViajes(origen: string, destino: string, fecha: string): Promise<Viaje[]> {
        return this.viajeRepository.getViajes(origen, destino, fecha);
    }

    async actualizarViaje(idViaje: number, detallesActualizados: Viaje): Promise<void> {
        return this.viajeRepository.actualizarViaje(idViaje, detallesActualizados);
    }

    async eliminarViaje(idViaje: number): Promise<void> {
        return this.viajeRepository.eliminarViaje(idViaje);
    }
}
