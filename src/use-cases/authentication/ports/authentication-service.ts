import {
  UserNotFoundError,
  WrongPasswordError,
} from "../../../use-cases/sign-in/errors";
import { Either } from "../../../shared";

export type AuthenticationParams = {
  email: string;
  password: string;
};

export type AuthenticationResult = {
  accessToken: string;
  id: string;
};

export interface AuthenticationService {
  auth(
    authenticationParams: AuthenticationParams
  ): Promise<
    Either<UserNotFoundError | WrongPasswordError, AuthenticationResult>
  >;
}
