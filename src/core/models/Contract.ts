export abstract class Contract {
  constructor(...args: any[]) {}

  toResponse(): object | string | null {
    return this;
  }
}
