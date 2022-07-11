declare global {
  /* eslint-disable no-unused-vars */
  namespace NodeJS {
    interface ProcessEnv {
      ENV: 'test' | 'development' | 'production'
      DB_URI: string
    }
  }
}
export {}
