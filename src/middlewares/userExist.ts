import { NextFunction, Request, Response } from "express";
import { listUsers } from "..";

export const userExist = (request: Request, response: Response, next: NextFunction) => {
    const { userId } = request.params;

    if(!userId){
        response.status(400).json({message:'Id não informado'})
    }

    const user = listUsers.some((user) => user.getId === userId)
    if(!user){
        response.status(400).json({message:'Usuário não cadastrado'})
    }

    return next();
}