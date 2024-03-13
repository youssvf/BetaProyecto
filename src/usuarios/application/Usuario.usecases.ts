import { compare, hash } from "../../context/security/encrypter";
import Usuario from "../domain/Usuario";
import UsuarioRepository from "../domain/Usuario.repository";

export default class UsuarioUseCases {
    constructor(private usuarioRepository: UsuarioRepository){};

    async registro(usuario: Usuario): Promise<Usuario>{
        if(!usuario.password)throw new Error("Falta password");
        const cifrada = hash(usuario.password);
        usuario.password = cifrada;
        return this.usuarioRepository.registro(usuario)
    }


    async login(usuario: Usuario): Promise<Usuario>{
        if(!usuario.password)throw new Error("Falta password");
        const usuarioBD = await this.usuarioRepository.login(usuario);
        if(!usuarioBD) throw new Error("Usuario no encontrado");
        const iguales = await compare(usuario.password, String(usuarioBD.password));
        if(iguales){
            return usuarioBD;
        }else{
            throw new Error("Contraseña incorrecta");
        }
    }
}