import { InMemoryUserRepository } from '@/tests/unit/use-cases/repositories'
import { FakeEncoder } from '@/tests/unit/use-cases/signup/fake-encoder'
import { SignUp } from '@/use-cases/sign-up'
import { SignUpController } from '@/web-controllers/sign-up'

export const makeSignUpController = (): SignUpController => {
  const userRepository = new InMemoryUserRepository([])
  const encoder = new FakeEncoder()
  const useCase = new SignUp(userRepository, encoder)
  const controller = new SignUpController(useCase)

  return controller
}
