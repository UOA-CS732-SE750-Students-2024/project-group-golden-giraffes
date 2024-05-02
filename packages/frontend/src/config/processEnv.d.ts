/**
 * Use module augmentation to include the environment variables to the `process.env` object.
 */
declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_API_URL?: string;
  }
}
