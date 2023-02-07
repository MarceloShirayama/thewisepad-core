import { makeTokenManager, makeUserRepository } from ".";
import { BcryptEncoder } from "../../external/encoder";
import { SignUpController } from "../../presentation/controllers";
import { CustomAuthentication } from "../../use-cases/authentication";
import { SignUp } from "../../use-cases/sign-up";

export function makeSignUpController() {
  const userRepository = makeUserRepository();

  const encoder = new BcryptEncoder();

  const tokenManager = makeTokenManager();

  const authenticationService = new CustomAuthentication(
    userRepository,
    encoder,
    tokenManager
  );

  const useCase = new SignUp(userRepository, encoder, authenticationService);

  const controller = new SignUpController(useCase);

  return controller;
}
