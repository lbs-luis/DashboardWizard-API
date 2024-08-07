export class OrderAlreadyExistsError extends Error {
  constructor() {
    super('Está comanda já existe.')
  }
}