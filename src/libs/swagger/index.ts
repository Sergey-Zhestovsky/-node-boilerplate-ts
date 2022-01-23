import { Config } from '../config';
import { Swagger as SwaggerBuilder } from './Swagger';

export * from './types';

export const Swagger = new SwaggerBuilder(Config.global.swagger);
