import { ObjectId } from "mongodb";

import { UserData, UserRepository } from "../../../use-cases/ports";
import { MongoHelper } from "./helpers";

export class MongodbUserRepository implements UserRepository {
  async findAll(): Promise<UserData[]> {
    throw new Error("Method not implemented.");
  }

  async findByEmail(email: string): Promise<UserData | null> {
    const userCollection = await MongoHelper.getCollection("users");
    const user = await userCollection.findOne({ email: email });

    return user
      ? {
          email: user.email as string,
          password: user.password as string,
          id: user._id.toString(),
        }
      : null;
  }

  async add(user: UserData): Promise<UserData> {
    const userCollection = await MongoHelper.getCollection("users");

    const userClone = {
      email: user.email,
      password: user.password,
      _id: null as unknown as ObjectId,
    };

    await userCollection.insertOne(userClone);

    return {
      email: userClone.email,
      password: userClone.password,
      id: userClone._id.toString(),
    };
  }
}
