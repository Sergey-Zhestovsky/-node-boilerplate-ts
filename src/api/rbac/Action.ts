type TSynchronizePayload = { id: string } | string;

class Action {
  public id: string | null;
  public name: string;

  constructor(id: string | null, name: string) {
    this.id = id ?? null;
    this.name = name;
  }

  get Synchronized() {
    return this.id !== null;
  }

  synchronize(id: TSynchronizePayload) {
    if (id instanceof Object) this.id = id.id;
    else this.id = id;
  }
}

export default Action;
