import { BcryptEncoder } from "../../external/encoder";
import { MongodbUserRepository } from "../../external/repositories/mongodb/mongodb-user-repository";
import { JwtTokenManager } from "../../external/token-manager";
import { SignInController } from "../../presentation/controllers";
import { CustomAuthentication } from "../../use-cases/authentication";
import { SignIn } from "../../use-cases/sign-in";
import { env } from "../config/environment";

export function makeSignInController() {
  const userRepository = new MongodbUserRepository();

  const encoder = new BcryptEncoder();

  const tokenManager = new JwtTokenManager(env.JWT_SECRET);

  const authenticationService = new CustomAuthentication(
    userRepository,
    encoder,
    tokenManager
  );

  const useCase = new SignIn(authenticationService);

  const controller = new SignInController(useCase);

  return controller;
}
