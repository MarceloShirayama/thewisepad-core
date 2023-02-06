import { Document, ObjectId } from "mongodb";

import { UserData, UserRepository } from "../../../use-cases/ports";
import { MongoHelper } from "./helpers";

export class MongodbUserRepository implements UserRepository {
  async findAll(): Promise<UserData[]> {
    throw new Error("Method not implemented.");
  }

  async findByEmail(email: string): Promise<UserData | null> {
    const userCollection = await MongoHelper.getCollection("users");
    const user = await userCollection.findOne({ email: email });

    return user ? this.withApplicationId(user) : null;
  }

  async add(user: UserData): Promise<UserData> {
    const userCollection = await MongoHelper.getCollection("users");

    const userClone = {
      email: user.email,
      password: user.password,
      _id: null as unknown as ObjectId,
    };

    await userCollection.insertOne(userClone);

    return this.withApplicationId(userClone);
  }

  private withApplicationId(dbUser: Document): UserData {
    return {
      email: dbUser.email,
      password: dbUser.password,
      id: dbUser._id,
    };
  }
}
