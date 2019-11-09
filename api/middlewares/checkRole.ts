import { BaseRequest, BaseResponse, HttpError, HttpCode } from "ts-framework";
import { NextFunction } from "express";
import * as jwt from 'jsonwebtoken';
import { JwtConfig } from "../../config";
import { getRepository } from "typeorm";
import { UserModel } from "../models";

export const checkRole = async (req: BaseRequest, res: BaseResponse, next: NextFunction) => {

    const token = req.body.token;
    let userId;

    try {
        userId = jwt.verify(token, JwtConfig.privateKey);
    } catch (error) {
        throw new HttpError("Token inválido", HttpCode.Client.UNAUTHORIZED)
    }

    const userRepository = getRepository(UserModel);
    const userdb = await userRepository.findOne(userId);
    
    if (userdb.role == "admin") {
        next()
    } else {
        throw new HttpError("Não autorizado", HttpCode.Client.UNAUTHORIZED)
    }
}