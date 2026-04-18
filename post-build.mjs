import fs from 'node:fs';
import path from 'node:path';

const srcSchema = path.resolve('src/db/schema.ts');
const distSchema = path.resolve('dist/db/schema.ts');

function run() {
  if (!fs.existsSync(srcSchema)) {
    console.error(`❌ Source schema not found: ${srcSchema}`);
    return;
  }

  let content = fs.readFileSync(srcSchema, 'utf8');

  // Replace internal relative type imports with the bundled entry point.
  // This converts: from '../types/quiz/quiz' -> from '../index.cjs'
  content = content.replace(/from\s+['"]\.\.\/types\/[^'"]+['"]/g, "from '../index.cjs'");

  fs.mkdirSync(path.dirname(distSchema), { recursive: true });
  fs.writeFileSync(distSchema, content);

  console.log('✅ Post-build: dist/db/schema.ts updated with corrected imports.');
}

run();
