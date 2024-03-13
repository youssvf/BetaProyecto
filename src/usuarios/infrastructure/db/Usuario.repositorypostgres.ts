import executeQuery from "../../../context/db/PostgresConnector";
import Usuario from "../../domain/Usuario";
import UsuarioRepository from "../../domain/Usuario.repository";

export default class UsuariosRepositoryPostgres implements UsuarioRepository{
    async registro(usuario: Usuario): Promise<Usuario> {
        const consulta = `
            INSERT INTO usuarios(
                nombre, 
                apellidos, 
                email, 
                password, 
                telefono
            )
            VALUES (
                '${usuario.nombre}', 
                '${usuario.apellidos}', 
                '${usuario.email}', 
                '${usuario.password}', 
                '${usuario.telefono}'
            )
            RETURNING *`;
    
        try {
            const rows: any[] = await executeQuery(consulta);
    
            const usuarioBD: Usuario = {
                nombre: rows[0].nombre,
                apellidos: rows[0].apellidos,
                email: rows[0].email,
                password: rows[0].password,
                telefono: rows[0].telefono
            };
    
            return usuarioBD;
        } catch (error) {
            console.error("Error en la consulta de registro:", error);
            throw new Error("Error en el registro de usuario");
        }
    }


    async login(usuario: Usuario): Promise<Usuario> {
        const consulta = `SELECT * FROM usuarios WHERE email = '${usuario.email}'`;
        try {
            const rows: any[] = await executeQuery(consulta);
        if(rows.length === 0){
            throw new Error("Usuario/contraseña no es correcto");
        }else{
            const usuarioBD: Usuario = {
                email: rows[0].email,
                password:rows[0].password,
                nombre: rows[0].nombre,
                apellidos: rows[0].apellidos,
                telefono: rows[0].telefono,
            }
            return usuarioBD;
        }
        } catch (error) {
            console.error("Error en la consulta de login:", error);
            throw new Error("Error en el inicio de sesión");
        }
    }
    

}