import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parts = [0, 1, 2, 3].map((i) => ({
  name: `seed_part_${i}`,
  sql: fs.readFileSync(path.join(__dirname, `seed-part-${i}.sql`), 'utf8'),
}));

console.log(JSON.stringify(parts.map((p) => ({ name: p.name, length: p.sql.length }))));
