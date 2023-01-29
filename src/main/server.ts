!(async () => {
  try {
    const { app } = await await import("./config/app");

    const PORT = Number(process.env.PORT) || 3000;

    app.listen(PORT, () => console.info(`Server running at:${PORT}`));
  } catch (error) {
    console.error(error);
  }
})();
