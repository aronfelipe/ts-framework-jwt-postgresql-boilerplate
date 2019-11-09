import { Controller, Get, BaseRequest, BaseResponse, HttpError, HttpCode, Post, Put } from 'ts-framework';
import { UserModel } from '../models';
import { getRepository } from 'typeorm';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';
import { ResponseInterface } from '../utils/ResponseInterface'

@Controller('/user')
export default class UserController {

  /**
   * GET /user/
   * 
   * @description List all users registered on the platform.
   */

  @Get('/', [checkJwt, checkRole]) 
  static async listUser(req: BaseRequest, res: BaseResponse) {
    try {
      const userRepository = getRepository(UserModel);
      
      const users = await userRepository.find();

      const response = <ResponseInterface> {
        token: res.locals.token,
        data: users
      }

      return res.success(response)

    } catch (error) {
      return res.error(error)
    }
  }

  /**
   * GET /user/:id
   * 
   * @description Find one user registered on the platform.
   */
  @Get('/:id', [checkJwt,checkRole])
  static async findUser(req: BaseRequest, res: BaseResponse) {
    try {

      const userRepository = getRepository(UserModel);

      const userdb = await userRepository.findOne(req.param('id'))

      const response = <ResponseInterface> {
        token: res.locals.token,
        data: userdb
      }

      return res.success(response)

    } catch (error) {
      return res.error(error)
    }
  }

  /**
   * POST /user/
   * 
   * @description Store one user on the platform.
   */

  @Post('/', [checkJwt,checkRole])
  static async storeUser(req: BaseRequest, res: BaseResponse) {

    try {

      const { name, email, role, password } = req.body;
      const userRepository = getRepository(UserModel);
      const userdb = await userRepository.findOne({where:{email}})

      if (userdb) {
        throw new HttpError('Email registrado na plataforma, prossiga com o login', HttpCode.Client.FORBIDDEN);
      }

      const insertUser = await userRepository.insert({
        name,
        email,
        role
      });

      const user = await userRepository.findOne(insertUser.identifiers[0].id)
      await user.setPassword(password);
      await user.save();

      const response = <ResponseInterface> {
        token: res.locals.token,
        data: user
      }

      return res.success(response)

    } catch (error) {
      return res.error(error)
    }
  }
}
