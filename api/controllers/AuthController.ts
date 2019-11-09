import { Controller, Get, BaseRequest, BaseResponse, HttpError, HttpCode, Post } from 'ts-framework';
import { getRepository } from 'typeorm';
import { UserModel } from '../models';
import JwtService from '../services/JwtService';

@Controller('/auth')
export default class AuthController {

  /**
   * POST /auth/login
   * 
   * @description Login on the platform.
   */

  @Post('/login')
  static async logIn(req: BaseRequest, res: BaseResponse) {

    try {

      const { email, password } = req.body;

      const userRepository = getRepository(UserModel);

      const userdb = await userRepository.findOne({where:{email}});

      if (!userdb) {
        throw new HttpError('Email não registrado na plataforma', HttpCode.Client.NOT_FOUND);
      }
  
      const matchPassword = await userdb.validadePassword(password);

      if (!matchPassword){
        throw new HttpError('Senha incorreta, tente novamente', HttpCode.Client.FORBIDDEN);
      }

      if (matchPassword) {
        const token = await JwtService.createSignToken(userdb);
        return res.success(token);
      }
    
    } catch (error) {
      return res.error(error)
    }
  }

    /**
   * POST /auth/login
   * 
   * @description Register on the platform.
   */

  @Post('/register')
  static async register(req: BaseRequest, res: BaseResponse) {

    try {

      const { name, email, password } = req.body;
      const userRepository = getRepository(UserModel);
      const userdb = await userRepository.findOne({where:{email}})

      if (userdb) {
        throw new HttpError('Email registrado na plataforma, prossiga com o login', HttpCode.Client.FORBIDDEN);
      }

      const insertUser = await userRepository.insert({
        name,
        email
      });

      const user = await userRepository.findOne(insertUser.identifiers[0].id)
      await user.setPassword(password);
      await user.save();

      return res.success("Registro confirmado na plataforma")

    } catch (error) {
      return res.error(error)
    }
  }

}
