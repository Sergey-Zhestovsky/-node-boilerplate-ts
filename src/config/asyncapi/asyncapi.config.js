module.exports = {
  withAsyncapi: process.env.ASYNCAPI === 'on',
  vars: {
    ASYNCAPI_PUBLIC_URL: process.env.ASYNCAPI_PUBLIC_URL,
  },
};
