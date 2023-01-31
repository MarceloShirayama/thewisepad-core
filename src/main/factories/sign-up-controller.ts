import { SignUpController } from "../../presentation/controllers/sign-up";
import { SignUp } from "../../use-cases/sign-up";
import { FakeEncoder } from "../../../tests/doubles/encoder";
import { InMemoryUserRepository } from "../../../tests/doubles/repositories";
import { makeAuthenticationServiceStub } from "../../../tests/doubles/authentication/authentication-stub";

export function makeSignUpController() {
  const userRepository = new InMemoryUserRepository([]);

  const encoder = new FakeEncoder();

  const { authenticationServiceStub } = makeAuthenticationServiceStub();

  const useCase = new SignUp(
    userRepository,
    encoder,
    authenticationServiceStub
  );

  const controller = new SignUpController(useCase);

  return controller;
}
