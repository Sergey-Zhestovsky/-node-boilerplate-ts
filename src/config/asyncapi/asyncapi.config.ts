interface IAsyncApiConfig {
  withAsyncapi: boolean;
  vars: Record<string, string>;
}

const config: IAsyncApiConfig = {
  withAsyncapi: process.env.ASYNCAPI === 'on',
  vars: {
    ASYNCAPI_PUBLIC_URL: process.env.ASYNCAPI_PUBLIC_URL as string,
  },
};

export default config;
