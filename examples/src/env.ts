declare global {
  interface Window {
    env: ImportMetaEnv;
  }
}

interface ImportMetaEnv {
  VITE_COLOR: string;
  [key: string]: string;
}

export const env = {
  ...import.meta.env,
  ...window.env,
} as ImportMetaEnv;

export default env;
