async function init() {
  try {
    const server = (await import("./config/app")).app;

    const PORT = Number(process.env.PORT) || 3000;

    server.listen(PORT, () => console.info(`Server running at:${PORT}`));
  } catch (error) {
    console.error(error);
  }
}

const server = init();
