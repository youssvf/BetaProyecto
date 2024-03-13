import express from 'express';
import ReservaRepositoryPostgres from '../db/ReservaRepositoryPostgres';
import ReservaUseCases from '../../application/ReservaUseCases';
import executeQuery from '../../../context/db/PostgresConnector';
import { isAuth } from '../../../context/security/auth';
import Reserva from '../../domain/Reserva';
import ViajeRepositoryPostgres from '../../../viajes/infrastructure/db/ViajeRepositoryPostgres';


const viajesRepository = new ViajeRepositoryPostgres();
const reservaRepository = new ReservaRepositoryPostgres(viajesRepository);
const reservasUseCases = new ReservaUseCases(reservaRepository);
const routerReservas = express.Router();    

routerReservas.post('/realizar', isAuth, async (req, res) => {
    const nuevaReserva: Reserva = req.body;
    try {
        await reservasUseCases.realizarReserva(nuevaReserva);
        res.status(201).json({ message: 'Reserva realizada exitosamente.', nuevaReserva });
    } catch (error) {
        console.error('Error al realizar la reserva:', error);
        res.status(500).json({ message: 'Error interno del servidor al realizar la reserva.' });
    }
});

routerReservas.get('/usuario/', isAuth, async (req, res) => {
    const emailUsuario = req.body.userEmail;
    try {
        const reservasUsuario = await reservasUseCases.getReservasUsuario(emailUsuario);
        res.json(reservasUsuario);
    } catch (error) {
        console.error('Error al obtener las reservas del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener las reservas del usuario.' });
    }
});

routerReservas.put('/confirmar/:id', isAuth, async (req, res) => {
    const idReserva = Number(req.params.id);
    const conductor = req.body.userEmail;
    try {
        await reservasUseCases.confirmarReserva(idReserva, conductor);
        res.json({ message: 'Reserva confirmada exitosamente.' });
    } catch (error) {
        console.error('Error al confirmar la reserva:', error);
        res.status(500).json({ message: 'Error interno del servidor al confirmar la reserva.' });
    }
});

routerReservas.put('/cancelar/:id', isAuth, async (req, res) => {
    const idReserva = Number(req.params.id);
    try {
        await reservasUseCases.cancelarReserva(idReserva);
        res.json({ message: 'Reserva cancelada exitosamente.' });
    } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        res.status(500).json({ message: 'Error interno del servidor al cancelar la reserva.' });
    }
});

routerReservas.get('/historial/', isAuth, async (req, res) => {
    const emailUsuario = req.body.userEmail;
    try {
        const historialReservas = await reservasUseCases.getHistorialReservasUsuario(emailUsuario);
        res.json(historialReservas);
    } catch (error) {
        console.error('Error al obtener el historial de reservas del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el historial de reservas del usuario.' });
    }
});

routerReservas.get('/solicitudes', isAuth, async (req, res) => {
    const conductorEmail = req.body.userEmail; 
  
    try {
      const query = `
        SELECT R.id AS reserva_id, V.id AS viaje_id, V.origen, V.destino, V.fechasalida, R.asientosreservados, R.estadoreserva, R.pasajero
        FROM Reservas R
        JOIN Viajes V ON R.viaje = V.id
        WHERE V.conductor = '${conductorEmail}'
          AND R.estadoreserva = 'pendiente';
      `;
  
      const reservasPendientes = await executeQuery(query);
      res.json(reservasPendientes);
    } catch (error) {
      console.error('Error al obtener las reservas pendientes:', error);
      res.status(500).json({ message: 'Error interno del servidor al obtener las reservas pendientes.' });
    }
  });

export default routerReservas;
