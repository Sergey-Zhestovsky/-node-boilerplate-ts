import { Environment } from '@/libs/config';
import { getServerDomain } from '@/utils';

interface IAsyncApiConfig {
  withAsyncapi: boolean;
  vars: Record<string, string>;
}

const defaultDomain = getServerDomain({ protocol: 'ws' });

const config: IAsyncApiConfig = {
  withAsyncapi: Environment.vars.ASYNCAPI === 'on',
  vars: {
    ASYNCAPI_PUBLIC_URL: Environment.vars.ASYNCAPI_PUBLIC_URL?.href ?? defaultDomain,
  },
};

export default config;
