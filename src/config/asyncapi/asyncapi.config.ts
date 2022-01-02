import { environment } from '@/libs/config';
import { getServerDomain } from '@/utils';

interface IAsyncApiConfig {
  withAsyncapi: boolean;
  vars: Record<string, string>;
}

const defaultDomain = getServerDomain({ protocol: 'ws' });

const config: IAsyncApiConfig = {
  withAsyncapi: environment.vars.ASYNCAPI === 'on',
  vars: {
    ASYNCAPI_PUBLIC_URL: environment.vars.ASYNCAPI_PUBLIC_URL?.href ?? defaultDomain,
  },
};

export default config;
