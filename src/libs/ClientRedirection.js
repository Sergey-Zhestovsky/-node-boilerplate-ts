class ClientRedirection {
  constructor({ status, location }) {
    this.status = status;
    this.location = location;
  }

  getRedirection() {
    return {
      status: this.status,
      location: this.location,
    };
  }

  redirect(res) {
    res.redirect(this.status, this.location);
  }
}

class Client301Redirection extends ClientRedirection {
  constructor(location) {
    super({ status: 301, location: location });
  }
}

class Client307Redirection extends ClientRedirection {
  constructor(location) {
    super({ status: 307, location: location });
  }
}

class Client308Redirection extends ClientRedirection {
  constructor(location) {
    super({ status: 308, location: location });
  }
}

module.exports = {
  ClientRedirection,
  Client301Redirection,
  Client307Redirection,
  Client308Redirection,
};
