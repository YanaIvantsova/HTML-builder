const fs = require('fs');
const path = require('path');

const folderPath = path.resolve(__dirname, 'styles');
const bundlePath = path.resolve(__dirname, 'project-dist', 'bundle.css');
const output = fs.createWriteStream(bundlePath);


fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err) {
        console.log('Error', err.message);
    }
    files.forEach((file) => {
        const filePath = path.resolve(folderPath, file.name);
        const fileExtension = path.parse(filePath).ext.slice(1);
        if ((file.isFile()) && (fileExtension == 'css')) {
            const input = fs.createReadStream(filePath, 'utf-8');
            let data = [];
            input.on('data', (chunk) => {
                data.push(chunk);
            })
            input.pipe(output)
        }
    })
})

