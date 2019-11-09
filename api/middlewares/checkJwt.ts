import { BaseRequest, BaseResponse, HttpError, HttpCode } from "ts-framework";
import { NextFunction } from "express";
import * as jwt from 'jsonwebtoken';
import { JwtConfig } from "../../config";
import { getRepository } from "typeorm";
import { UserModel } from "../models";
import JwtService from "../services/JwtService";

export const checkJwt = async (req: BaseRequest, res: BaseResponse, next: NextFunction) => {

    const token = req.body.token;
    let userId;

    try {
        userId = jwt.verify(token, JwtConfig.privateKey);
    } catch (error) {
        throw new HttpError("Token inválido", HttpCode.Client.UNAUTHORIZED)
    }

    const userRepository = getRepository(UserModel);
    const userdb = await userRepository.findOne(userId);
    const newToken = await JwtService.createSignToken(userdb)

    res.locals.token = newToken;
    res.locals.userId = userId;

    next();
}