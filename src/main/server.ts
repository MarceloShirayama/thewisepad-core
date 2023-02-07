import { MongoHelper } from "../external/repositories/mongodb/helpers";

async function init() {
  try {
    const server = (await import("./config/app")).app;
    await MongoHelper.connect();

    const PORT = Number(process.env.PORT) || 3000;

    server.listen(PORT, () => console.info(`Server running at:${PORT}`));
  } catch (error) {
    console.error(error);
  }
}

init();
