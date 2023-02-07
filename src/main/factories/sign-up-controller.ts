import { BcryptEncoder } from "../../external/encoder";
import { MongodbUserRepository } from "../../external/repositories/mongodb/mongodb-user-repository";
import { JwtTokenManager } from "../../external/token-manager";
import { SignUpController } from "../../presentation/controllers";
import { CustomAuthentication } from "../../use-cases/authentication";
import { SignUp } from "../../use-cases/sign-up";

export function makeSignUpController() {
  const userRepository = new MongodbUserRepository();

  const encoder = new BcryptEncoder();

  const tokenManager = new JwtTokenManager("my secret");

  const authenticationService = new CustomAuthentication(
    userRepository,
    encoder,
    tokenManager
  );

  const useCase = new SignUp(userRepository, encoder, authenticationService);

  const controller = new SignUpController(useCase);

  return controller;
}
