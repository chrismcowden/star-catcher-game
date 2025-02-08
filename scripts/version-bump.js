const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Bump type can be 'major', 'minor', or 'patch'
const bumpType = process.argv[2] || 'patch';
const packagePath = path.join(__dirname, '..', 'package.json');

// Read current package.json
const package = require(packagePath);
const [major, minor, patch] = package.version.split('.').map(Number);

// Calculate new version
let newVersion;
switch(bumpType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
  default:
    console.error('Invalid bump type. Use major, minor, or patch');
    process.exit(1);
}

// Update package.json
package.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(package, null, 2) + '\n');

// Create git tag
try {
  execSync(`git add package.json`);
  execSync(`git commit -m "chore: bump version to ${newVersion}"`);
  execSync(`git tag -a v${newVersion} -m "Version ${newVersion}"`);
  console.log(`Successfully bumped version to ${newVersion}`);
  console.log('Remember to push changes and tags:');
  console.log('git push && git push --tags');
} catch (error) {
  console.error('Error creating git tag:', error);
  process.exit(1);
}