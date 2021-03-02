import Server from 'gas-client';

const { PORT } = process.env;

type SCIServer = Server & {
  serverFunctions: {
    packTranslations(): Promise<string>; // base64
  };
};

const server: SCIServer = new Server({
  // this is necessary for local development but will be ignored in production
  allowedDevelopmentDomains: `https://localhost:${PORT}`,
});

export default server;
