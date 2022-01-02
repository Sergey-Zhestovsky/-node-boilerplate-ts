import { environment } from '@/libs/config';
import { getServerDomain } from '@/utils';

export default {
  withSwagger: environment.vars.SWAGGER === 'on',
  serverURL: environment.vars.SWAGGER_SERVER_URL?.href ?? getServerDomain(),
};
