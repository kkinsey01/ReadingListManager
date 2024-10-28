const fs = require('fs');
const path = require('path');

const copyFile = (src, dest) => {
    fs.copyFile(src, dest, (err) => {
        if (err) throw err;
        console.log(`${src} was copied to ${dest}`);
    });
};

const bootstrapCssSrc = path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'css', 'bootstrap.min.css');
const bootstrapJsSrc = path.join(__dirname, 'node_modules', 'bootstrap', 'dist', 'js', 'bootstrap.bundle.min.js');

const cssDest = path.join(__dirname, 'public', 'css', 'bootstrap.min.css');
const jsDest = path.join(__dirname, 'public', 'js', 'bootstrap.bundle.min.js');

// Create directories if they don't exist
fs.mkdirSync(path.join(__dirname, 'public', 'css'), { recursive: true });
fs.mkdirSync(path.join(__dirname, 'public', 'js'), { recursive: true });

// Copy the files
copyFile(bootstrapCssSrc, cssDest);
copyFile(bootstrapJsSrc, jsDest);
