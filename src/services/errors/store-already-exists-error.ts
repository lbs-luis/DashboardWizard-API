export class StoreAlreadyExistsError extends Error {
  constructor() {
    super('Store already exists.')
  }
}