export abstract class Contract {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(...args: any[]) {}

  toResponse(): object | string | null {
    return this;
  }
}
