import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import Usuario from "../../usuarios/domain/Usuario";
const SECRET_KEY: Secret = "miclave";

const decode = (token: string) => {
  return jwt.decode(token);
};

const createToken = (user: Usuario): string => {
  const payload = {
    userEmail: user.email,  
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1 days" });
};

const isAuth = (req: Request, response: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token: string | undefined = authHeader && authHeader.split(" ")[1];
    if (token) {
      const decoded: any = jwt.verify(token, SECRET_KEY);
      req.body.userEmail = decoded.userEmail;
      next();
    } else {
      response.status(401).json({ mensaje: "No autorizado" });
    }
  } catch (err) {
    console.error(err);
    response.status(401).json({ mensaje: "No autorizado" });
  }
};

export { decode, createToken, isAuth };