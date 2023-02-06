import { NextFunction, Request, Response } from "express";
import { listUsers } from "..";

export const CPFCadastrado = (request: Request, response: Response, next: NextFunction)=>{
    const { cpf } = request.body;
    const newCPF = cpf.replace(/[^a-zA-Z0-9]/g, '');
    const existeCPF = listUsers.some((user) => user.getCpf === newCPF );
    
    if(existeCPF){
        return response.status(400).json({message: 'CPF já cadastrado'})
    }
    return next();
}