import { MongoHelper } from "src/external/repositories/mongodb/helpers";
import { MongodbUserRepository } from "src/external/repositories/mongodb/mondodb-user-repository";
import { UserBuilder } from "test/builders/user-builder";

describe("Mongodb user repository", () => {
  beforeAll(async () => await MongoHelper.connect());

  afterAll(async () => await MongoHelper.disconnect());

  beforeEach(async () => await MongoHelper.clearCollection("users"));

  it("Should add a valid user", async () => {
    const repository = new MongodbUserRepository();

    const validUser = UserBuilder.createUser().build();

    await repository.add(validUser);

    const user = await repository.findByEmail(validUser.email);

    expect(user?.id).toBeTruthy();
    expect(user?.id).not.toBe(validUser.id);
  });
});
