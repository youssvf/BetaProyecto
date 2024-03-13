import Usuario from "../../usuarios/domain/Usuario";
import Viaje from "./Viaje";

export default interface ViajeRepository {
    getAll():Promise<Viaje[]>;
    crearViaje(viaje: Viaje, usuario : Usuario): Promise<void>;
    getViaje(idViaje: number): Promise<Viaje | undefined>;
    getViajes(origen: string, destino: string, fecha: string): Promise<Viaje[]>;
    actualizarViaje(idViaje: number, detallesActualizados: Viaje): Promise<void>;
    eliminarViaje(idViaje: number): Promise<void>;
}
