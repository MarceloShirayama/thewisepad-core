import { makeEncoder, makeTokenManager, makeUserRepository } from ".";
import { SignInController } from "../../presentation/controllers";
import { CustomAuthentication } from "../../use-cases/authentication";
import { SignIn } from "../../use-cases/sign-in";

export function makeSignInController() {
  const userRepository = makeUserRepository();

  const encoder = makeEncoder();

  const tokenManager = makeTokenManager();

  const authenticationService = new CustomAuthentication(
    userRepository,
    encoder,
    tokenManager
  );

  const useCase = new SignIn(authenticationService);

  const controller = new SignInController(useCase);

  return controller;
}
