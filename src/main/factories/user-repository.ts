import { MongodbUserRepository } from "../../external/repositories/mongodb";

export function makeUserRepository() {
  return new MongodbUserRepository();
}
