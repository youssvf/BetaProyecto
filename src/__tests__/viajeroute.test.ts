import ViajeUseCases from '../viajes/application/ViajeUseCases';
import ViajeRepository from '../viajes/domain/ViajeRepository';
import Usuario from '../usuarios/domain/Usuario';
import Viaje from '../viajes/domain/Viaje';

// Mock del Repositorio de Viajes
const mockViajeRepository: ViajeRepository = {
  getAll: jest.fn(),
  crearViaje: jest.fn(),
  getViaje: jest.fn(),
  getViajes: jest.fn(),
  actualizarViaje: jest.fn(),
  eliminarViaje: jest.fn(),
};

const viajeUseCases = new ViajeUseCases(mockViajeRepository);

describe('ViajeUseCases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getAll() debería llamar a getAll() del repositorio', async () => {
    await viajeUseCases.getAll();
    expect(mockViajeRepository.getAll).toHaveBeenCalled();
  });

  it('crearViaje() debería llamar a crearViaje() del repositorio', async () => {
    ;
    const usuario: Usuario = {
      "id":1,
      "email": "ecasado@fp.com"
    };
    const viaje: Viaje = {
      "conductor" : usuario.id,
      "origen": "Parque del Encuentro",
      "destino": "CPIFP Pirámide",
      "fechasalida": "2024-03-17T10:20:00",
      "asientosdisponibles": 1,
      "precio": 2.00,
      "descripcion": "Viaje cómodo y seguro"
    }
    await viajeUseCases.crearViaje(viaje, usuario);
    expect(mockViajeRepository.crearViaje).toHaveBeenCalledWith(viaje, usuario);
  });

});
