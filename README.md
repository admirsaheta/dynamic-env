<div style="width: 100vw; display: flex; justify-content: center;">
  <img src="https://github.com/user-attachments/assets/17bbc6a4-84c3-44f6-b056-90da4481f5c3" width="600" height="300" alt="Dynamic Env Logo" />
</div>

# @spacier/dynamic-env

A lightweight utility for managing environment variables in applications, with special support for Vite ( meaning not limited to react ) and Create React App.

## Features

- 🚀 Runtime environment variable injection
- 🔄 Support for both Vite and Create React App
- 🛠️ Simple CLI interface
- 🔒 Type-safe environment variables
- 📦 Zero runtime dependencies

## Installation

```bash
npm install @spacier/dynamic-env
# or
yarn add @spacier/dynamic-env
# or
pnpm add @spacier/dynamic-env
```

## Usage

### 1. Set up environment variables

Create a `.env` file in your project root:

```env
VITE_API_URL="https://api.example.com"
REACT_APP_API_KEY="your-api-key"
```

### 2. Configure your application

Add the environment script to your HTML file:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="/env.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

### 3. Create a type-safe environment configuration

```typescript
// env.ts
declare global {
  interface Window {
    env: ImportMetaEnv;
  }
}

interface ImportMetaEnv {
  VITE_API_URL: string;
  REACT_APP_API_KEY: string;
  [key: string]: string;
}

export const env = {
  ...import.meta.env,
  ...window.env,
} as ImportMetaEnv;

export default env;
```

### 4. Use environment variables

```typescript
import { env } from './env';

function App() {
  return (
    <div>
      <p>API URL: {env.VITE_API_URL}</p>
    </div>
  );
}
```

## CLI Commands

### Set Environment Variables

Inject environment variables into your build:

```bash
npx dynamic-env set --dir dist
```

```bash
VITE_COLOR=red npx dynamic-env set --dir dist --name env.js
```

Options:
- `--dir, -d`: Build directory path (default: "./build")
- `--name, -n`: Output filename (default: "env.js")
- `--var, -v`: Variable name in window object (default: "env")

### Build with Environment Variables

Build your application with environment variable placeholders:

```bash
npx dynamic-env build "npm run build"
```

Options:
- `--dotenv`: Enable .env file support (default: true)
- `--bypass`: Skip environment variable injection

## TypeScript Support

The library includes built-in TypeScript declarations. No additional setup required.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Admir Saheta
