import { makeAuthenticationStub } from '@/tests/doubles/authentication'
import { FakeEncoder } from '@/tests/doubles/encoders'
import { InMemoryUserRepository } from '@/tests/doubles/repositories'
import { SignUp } from '@/use-cases/sign-up'
import { SignUpController } from '@/web-controllers/sign-up'

export const makeSignUpController = (): SignUpController => {
  const userRepository = new InMemoryUserRepository([])
  const encoder = new FakeEncoder()
  const useCase = new SignUp(userRepository, encoder, makeAuthenticationStub)
  const controller = new SignUpController(useCase)

  return controller
}
