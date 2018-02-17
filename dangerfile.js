import { danger, warn } from 'danger';
import fs from 'fs';
import path from 'path';

function absolute (relPath) {
  return path.resolve(__dirname, relPath);
}

const flowIgnorePaths = ['node_modules', 'test', 'build', 'examples', 'doc', 'android', 'ios', 'bin', 'dist', 'flow-typed'].map(rel => {
  return absolute(rel);
});

const jsFiles = danger.git.created_files.filter(path.endsWith('js'));

// new js files should have `@flow` at the top
const unFlowedFiles = jsFiles.filter(filepath => {
  flowIgnorePaths.map(p => {
    if (absolute(filepath).indexOf(p) > -1) { return false; }
    return true;
  });
  const content = fs.readFileSync(filepath);
  return !content.includes('@flow');
});

if (unFlowedFiles.length > 0) {
  warn(`These new JS files do not have Flow enabled: ${unFlowedFiles.join(', ')}`);
}
