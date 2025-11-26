import { readFileSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';


const root = 'src/assets/version.json';

const rawData = readFileSync(root, 'utf-8');
const versionData = JSON.parse(rawData);
const [major, minor, patch] = versionData.version.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;
versionData.version = newVersion;


const hostname = os.hostname();
const envPath = path.resolve('src/environments/environment.prod.ts');

let content = readFileSync(envPath, 'utf8');

content = content.replace(/apiUrl:\s*['"][^'"]+['"]/, `apiUrl: 'http://${hostname}:5000'`);
content = content.replace(/appVersion:\s*['"`](.*?)['"`]/,`appVersion: '${newVersion}'`);

writeFileSync(envPath, content);
writeFileSync(root, JSON.stringify(versionData, null, 2));

