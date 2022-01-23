import { Request } from 'express';
import * as requestIp from 'request-ip';

export const retrieveIpAddress = (req: Request) => {
  if (req.clientIp) return req.clientIp;
  return requestIp.getClientIp(req) ?? req.ip;
};
