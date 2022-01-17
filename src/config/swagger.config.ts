import { environment } from '@/libs/config';
import { ISwaggerOptions } from '@/libs/swagger';
import { getServerDomain } from '@/utils';

const config: ISwaggerOptions = {
  withSwagger: environment.vars.SWAGGER === 'on',
  baseOpenAPI: {
    openapi: '3.0.2',
    info: {
      title: 'Boilerplate TS Node Server',
      version: '0.0.0',
    },
    servers: [{ url: environment.vars.SWAGGER_SERVER_URL?.href ?? getServerDomain() }],
  },
};

export default config;
