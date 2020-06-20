export class BaseModel<T extends BaseModel<T>, R = Record<string, any>> {
  constructor(args: { [key in keyof Omit<T, keyof BaseModel<T>>]: T[key] }) {
    Object.assign(this, args);
  }
}
