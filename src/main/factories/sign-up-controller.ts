import { SignUpController } from "../../presentation/controllers";
import { SignUp } from "../../use-cases/sign-up";
import { FakeEncoder } from "../../../test/doubles/encoder";
import { InMemoryUserRepository } from "../../../test/doubles/repositories";
import { makeAuthenticationServiceStub } from "../../../test/doubles/authentication";

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
