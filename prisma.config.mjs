import fs from 'node:fs';
import path from 'node:path';

function getDatabaseUrl() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
    if (match) return match[1];
  }
  return process.env.DATABASE_URL;
}

export default {
  schema: 'prisma/schema.prisma',
  datasource: {
    url: getDatabaseUrl(),
  },
};
