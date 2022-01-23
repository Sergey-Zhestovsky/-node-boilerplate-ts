import { Environment } from '@/libs/config';

interface IDefaultValues {
  host?: string;
  port?: number;
  protocol?: string;
}

export const getServerDomain = ({
  host = 'localhost',
  port = 3000,
  protocol = 'http',
}: IDefaultValues = {}) => {
  const resHost = Environment.vars.HOST ?? host;
  const resPort = Environment.vars.PORT ?? port;
  return `${protocol}://${resHost}:${resPort}`;
};
