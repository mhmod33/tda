require('dotenv').config();
const fs = require('fs');

const mapboxToken = process.env.mapbox_token || '';

const dir = './src/environments';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const devConfig = `export const environment = {
  production: false,
  mapboxToken: '${mapboxToken}'
};
`;

const prodConfig = `export const environment = {
  production: true,
  mapboxToken: '${mapboxToken}'
};
`;

fs.writeFileSync(`${dir}/environment.ts`, devConfig);
fs.writeFileSync(`${dir}/environment.development.ts`, devConfig);
fs.writeFileSync(`${dir}/env.ts`, devConfig);
fs.writeFileSync(`${dir}/env.prod.ts`, prodConfig);
