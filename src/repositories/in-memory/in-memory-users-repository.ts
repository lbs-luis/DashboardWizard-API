import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users/users-repository";

export class InMemorUsersRepository implements UsersRepository {
  public registers: User[] = []

  async findById(id: string) {
    const user = this.registers.find(register => register.id === id)
    if (!user) { return null }
    return user
  }

  async findByEmail(email: string) {
    const user = this.registers.find(register => register.email === email)
    if (!user) { return null }
    return user
  }
  async create({ email, name, password_hash, role }: Prisma.UserCreateInput) {
    const user: User = {
      id: `user-${this.registers.length}`,
      email,
      name,
      password_hash,
      role: role || "OPERATOR",
      created_at: new Date()
    }

    this.registers.push(user);

    return user
  }
}
