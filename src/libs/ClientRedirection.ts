import { Response } from 'express';

interface IClientRedirectionConstructor {
  status: number;
  location: string;
}

export class ClientRedirection {
  private readonly status: number;
  private readonly location: string;

  constructor({ status, location }: IClientRedirectionConstructor) {
    this.status = status;
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

export class Client301Redirection extends ClientRedirection {
  constructor(location: string) {
    super({ status: 301, location: location });
  }
}

export class Client307Redirection extends ClientRedirection {
  constructor(location: string) {
    super({ status: 307, location: location });
  }
}

export class Client308Redirection extends ClientRedirection {
  constructor(location: string) {
    super({ status: 308, location: location });
  }
}

export default ClientRedirection;
