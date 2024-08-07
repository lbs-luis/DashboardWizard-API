import { UsersRepository } from "@/repositories/users/users-repository";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthenticateServiceRequest {
  email: string;
  password: string;
}
interface AuthenticateServiceResponse {
  user: User
}


export class AuthenticateService {
  constructor(
    private usersRepository: UsersRepository
  ) { }

  async execute({ email, password }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.usersRepository.findByEmail(email)
    if (!user) { throw new InvalidCredentialsError() }

    const doesPasswordsMatches = await compare(password, user.password_hash)
    if (!doesPasswordsMatches) { throw new InvalidCredentialsError() }

    return {
      user
    }
  }
}