import { BaseError, Service, ServiceOptions } from 'ts-framework-common';
import { UserModel } from '../models';
import { JwtConfig } from '../../config';
import * as jwt from 'jsonwebtoken';

export interface JwtServiceOptions extends ServiceOptions {
}

export interface DataStoredInToken {
  id: string;
}

export interface Jwtoken {
  token: string
}

export default class JwtService extends Service {
  protected static instance: JwtService;
  public options: JwtServiceOptions;

  constructor(options: JwtServiceOptions) {
    super(options);
  }

  public static getInstance(options: JwtServiceOptions) {
    if (!this.instance) {
      throw new BaseError("Jwt service is invalid or hasn't been initialized yet");
    }
    return this.instance;
  }

  public static initialize(options: JwtServiceOptions) {
    const service = new JwtService(options);

    if(!this.instance) {
      this.instance = service;
    }

    return service;
  }

  public static async createSignToken(user: UserModel) {
    try {
      const expiresIn = 60*15;
      const secret = JwtConfig.privateKey;
      const datatStoredInToken: DataStoredInToken = {
        id: user.id
      }

      return {
        expiresIn,
        token: jwt.sign(datatStoredInToken, secret, { expiresIn })
      }

    } catch (error) {
      console.error(error)
    }
  }
  
  async onMount(): Promise<void> {
    this.logger.debug('Mounting JwtService instance');
  }

  async onInit(): Promise<void> {
    this.logger.debug('Initializing JwtService instance');
  }

  async onReady(): Promise<void> {
    this.logger.info('JwtService initialized successfully');
  }

  async onUnmount(): Promise<void> {
    this.logger.debug('Unmounting JwtService instance');
  }
}