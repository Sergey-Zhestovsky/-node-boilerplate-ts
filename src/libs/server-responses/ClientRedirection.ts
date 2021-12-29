import { Response } from 'express';

interface IBaseClientRedirection {
  status: number;
}

interface IClientRedirection extends Partial<IBaseClientRedirection> {
  location: string;
}

export class ClientRedirection {
  private readonly status: number;
  private readonly location: string;

  constructor({ status, location }: IClientRedirection) {
    this.status = status ?? 307;
    this.location = location;
  }

  getRedirection() {
    return {
      status: this.status,
      location: this.location,
    };
  }

  redirect(res: Response) {
    res.redirect(this.status, this.location);
  }
}

const buildRedirectClass = (defaultOptions: IBaseClientRedirection) => {
  return class extends ClientRedirection {
    constructor(location: string) {
      super({ ...defaultOptions, location: location });
    }
  };
};

export const Client301Redirection = buildRedirectClass({ status: 301 });
export const Client307Redirection = buildRedirectClass({ status: 307 });
export const Client308Redirection = buildRedirectClass({ status: 308 });

export default ClientRedirection;
