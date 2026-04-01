require('dotenv').config();
const fs = require('fs');

if (!process.env.mapbox_token) {
  throw new Error('Missing mapbox_token in .env');
}

const envConfig = `export const environment = {
  production: false,
  mapboxToken: '${process.env.mapbox_token}'
};
`;

fs.writeFileSync('./src/environments/environment.ts', envConfig);
fs.writeFileSync('./src/environments/environment.development.ts', envConfig);
