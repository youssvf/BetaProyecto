import dotenv from "dotenv";
import express from "express";
import cors from "cors"
import { routerUsuarios } from "./src/usuarios/infrastructure/rest/Usuario.router";
import routerViajes from "./src/viajes/infrastructure/rest/ViajeRoute";
import routerReservas from "./src/reserva/infrastructure/rest/ReservasRoute";


dotenv.config();

const app = express();
const port = process.env.PORT;
const allowedOrigins = ["http://localhost:5173","http://34.201.190.251"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(express.json());
app.use(cors(options));

app.use('/api/usuarios', routerUsuarios);
app.use('/api/viajes', routerViajes);
app.use('/api/reservas',routerReservas);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
