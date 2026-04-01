require('dotenv').config();
const fs = require('fs');
const path = require('path');

// ✅ Validate env (يشتغل على Netlify أو local)
const mapboxToken = process.env.mapbox_token;

if (!mapboxToken) {
  throw new Error('❌ Missing mapbox_token (env or Netlify)');
}

// 📁 تحديد المسار
const envDir = path.join(__dirname, 'src', 'environments');

// ✅ إنشاء الفولدر لو مش موجود
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// 📄 function لتوليد config
const createEnv = (isProd) => `export const environment = {
  production: ${isProd},
  mapboxToken: '${mapboxToken}'
};
`;

// 📄 أسماء الملفات المطلوبة
const files = [
  { name: 'environment.ts', prod: false },
  { name: 'environment.development.ts', prod: false },
  { name: 'env.prod.ts', prod: true }, // 👈 ده المهم
];

// ✍️ كتابة الملفات
files.forEach(file => {
  fs.writeFileSync(
    path.join(envDir, file.name),
    createEnv(file.prod)
  );
});

console.log('✅ All environment files generated successfully');