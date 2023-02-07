import { Collection, MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

export const MongoHelper = {
  mongodbInstance: null as unknown as MongoMemoryServer,
  client: null as unknown as MongoClient,
  uri: null as unknown as string,
  dbName: "testDB",

  async connect() {
    this.mongodbInstance = await MongoMemoryServer.create();

    this.uri = process.env.URI_DATABASE
      ? process.env.URI_DATABASE
      : this.mongodbInstance.getUri();

    this.client = new MongoClient(this.uri);

    this.client.db(this.dbName);

    await this.client.connect();

    console.info(`MongoDB connected to ${this.uri + this.dbName}`);
  },

  async disconnect() {
    await this.client.close();
    await this.mongodbInstance.stop();
    console.info("MongoDB disconnected...!");
  },

  async getCollection(name: string): Promise<Collection> {
    return this.client.db().collection(name);
  },

  async clearCollection(name: string): Promise<void> {
    this.client.db().collection(name).deleteMany({});
  },
};
