import express from 'express';
import Viaje from "../../domain/Viaje";
import ViajeRepository from "../../domain/ViajeRepository";
import ViajeRepositoryPostgres from "../db/ViajeRepositoryPostgres";
import ViajeUseCases from "../../application/ViajeUseCases";
import executeQuery from "../../../context/db/PostgresConnector";
import { isAuth } from "../../../context/security/auth";
import Usuario from "../../../usuarios/domain/Usuario";

const viajeRepository: ViajeRepository = new ViajeRepositoryPostgres();
const viajeUseCases: ViajeUseCases = new ViajeUseCases(viajeRepository);

const routerViajes = express.Router();

routerViajes.get("/", async (req, res) => {
    try {
        const viajes = await viajeUseCases.getAll();
        res.json(viajes);
    } catch (error) {
        console.error("Error al obtener todos los viajes:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener todos los viajes." });
    }
});

routerViajes.post("/crear", isAuth, async (req, res) => {
    const nuevoViaje: Viaje = req.body;
    const usuario = {
        email: String(req.body.userEmail),
    }
    try {
        await viajeUseCases.crearViaje(nuevoViaje,usuario);
        res.status(201).json({ nuevoViaje });
    } catch (error) {
        console.error("Error al crear el viaje:", error);
        res.status(500).json({ message: "Error interno del servidor al crear el viaje." });
    }
});

routerViajes.get("/:id", async (req, res) => {
    const idViaje: number = parseInt(req.params.id, 10);
    try {
        const viaje = await viajeUseCases.getViaje(idViaje);
        if (viaje) {
            res.json(viaje);
        } else {
            res.status(404).json({ message: "Viaje no encontrado." });
        }
    } catch (error) {
        console.error("Error al obtener detalles del viaje:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener detalles del viaje." });
    }
});

routerViajes.get("/buscar/:origen/:destino/:fecha", async (req, res) => {
    const { origen, destino, fecha } = req.params;
    try {
        const viajesDisponibles = await viajeUseCases.getViajes(origen, destino, fecha);
        res.json(viajesDisponibles);
    } catch (error) {
        console.error("Error al buscar viajes disponibles:", error);
        res.status(500).json({ message: "Error interno del servidor al buscar viajes disponibles." });
    }
});

routerViajes.put("/actualizar/:id", isAuth, async (req, res) => {
    const idViaje = Number(req.params.id);
    const detallesActualizados: Viaje = req.body;
    try {
        await viajeUseCases.actualizarViaje(idViaje, detallesActualizados);
        res.json({ message: "Detalles del viaje actualizados exitosamente." });
    } catch (error) {
        console.error("Error al actualizar detalles del viaje:", error);
        res.status(500).json({ message: "Error interno del servidor al actualizar detalles del viaje." });
    }
});

routerViajes.delete("/eliminar/:id", isAuth, async (req, res) => {
    const idViaje: number = parseInt(req.params.id, 10);
    try {
        await viajeUseCases.eliminarViaje(idViaje);
        res.json({ message: "Viaje eliminado :", idViaje });
    } catch (error) {
        console.error("Error al eliminar el viaje:", error);
        res.status(500).json({ message: "Error interno del servidor al eliminar el viaje." });
    }
});

export default routerViajes;