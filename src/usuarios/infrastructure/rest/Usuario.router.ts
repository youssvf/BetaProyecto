import express from "express";
import UsuariosRepositoryPostgres from "../db/Usuario.repositorypostgres";
import Usuario from "../../domain/Usuario";
import { createToken } from "../../../context/security/auth";
import UsuarioUseCases from "../../application/Usuario.usecases";

const usuarioUseCases: UsuarioUseCases = new UsuarioUseCases(new UsuariosRepositoryPostgres);

const router = express.Router();

router.post("/registro", async (req, res) => {
    try {
        const usuarioIntroducido = req.body;
        const usuarioNuevo: Usuario = {
            nombre: usuarioIntroducido.nombre,
            password: usuarioIntroducido.password,
            email: usuarioIntroducido.email,
            apellidos: usuarioIntroducido.apellidos,
            telefono: usuarioIntroducido.telefono,
        }

        const usuario: Usuario = await usuarioUseCases.registro(usuarioNuevo);
        res.json({email : usuario.email});
    } catch (error) {
        console.error("Error en el endpoint de registro:", error);
        res.status(500).json({ mensaje: "Error en el registro de usuario" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const usuarioAPI = req.body;
        const usuarioDB: Usuario = await usuarioUseCases.login(usuarioAPI);
        if (!usuarioDB) {
            res.status(404).json({ mensaje: "Usuario no encontrado" });
        } else {
            const token = createToken(usuarioDB);
            const usuario = {
                email: usuarioDB.email,
                nombre: usuarioDB.nombre,
                apellidos: usuarioDB.apellidos,
                telefono: usuarioDB.telefono
            }
            res.json({ usuario, token });
        }
    } catch (error) {
        console.error("Error en el endpoint de login:", error);
        res.status(500).json({ mensaje: "Datos incorrectos" });
    }
});

export { router as routerUsuarios };
