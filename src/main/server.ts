import { config } from "dotenv";

config();

import { MongoHelper } from "../external/repositories/mongodb/helpers";

async function init() {
  try {
    await MongoHelper.connect();

    const server = (await import("./config/app")).app;

    const PORT = Number(process.env.SERVER_PORT) || 3000;

    server.listen(PORT, () => console.info(`Server running at:${PORT}`));
  } catch (error) {
    console.error(error);
  }
}

init();
