import fs from 'fs';
import path from 'path';

function stripBOM(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Stripped BOM from ' + filePath);
    }
  }
}

['package.json', 'tsconfig.json', 'index.html', 'vite.config.ts', 'tailwind.config.js', 'postcss.config.js'].forEach(stripBOM);
