import { MongoHelper } from "src/external/repositories/mongodb/helpers";
import { MongodbUserRepository } from "src/external/repositories/mongodb/mongodb-user-repository";
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

  it("Should add two users and find all", async () => {
    const repository = new MongodbUserRepository();

    const validUser1 = UserBuilder.createUser().build();
    const validUser2 = UserBuilder.createUser().withDifferentEmail().build();

    await repository.add(validUser1);
    await repository.add(validUser2);

    const users = await repository.findAll();

    expect(users.length).toBe(2);
    expect(users[0]).toHaveProperty("id");
    expect(users[1]).toHaveProperty("id");
  });
});
