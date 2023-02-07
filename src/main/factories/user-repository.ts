import { MongodbUserRepository } from "../../external/repositories/mongodb/mongodb-user-repository";

export function makeUserRepository() {
  return new MongodbUserRepository();
}
