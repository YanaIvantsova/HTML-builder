const fs = require('fs');
const path = require('path');
const folderPath = path.resolve(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log('Error', err.message);
  }
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.resolve(folderPath, file.name);
      const fileName = path.parse(filePath).name;
      const fileExtension = path.parse(filePath).ext.slice(1);
      fs.stat(filePath, (err, stats) => {
        if (err) console.log('Error', err.message);
        const fileSize = (stats.size / 1000).toFixed(3);
        console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
      });
    }
  });
});
