import { SignUpController } from "@/presentation/controllers/sign-up";
import { SignUp } from "@/use-cases/sign-up";
import { FakeEncoder } from "tests/doubles/encoder";
import { InMemoryUserRepository } from "tests/doubles/repositories";

export function makeSignUpController() {
  const userRepository = new InMemoryUserRepository([]);

  const encoder = new FakeEncoder();

  const useCase = new SignUp(userRepository, encoder);

  const controller = new SignUpController(useCase);

  return controller;
}
