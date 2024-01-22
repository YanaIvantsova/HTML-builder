const fs = require('fs/promises');
const path = require('path');

const folderPath = path.resolve(__dirname, 'files');
const copyFolderPath = path.resolve(__dirname, 'files-copy');


async function copyDir() {
    try {
        await fs.rm(copyFolderPath, { recursive: true, force: true });
        await fs.mkdir(copyFolderPath, { recursive: true });
        const files = await fs.readdir(folderPath);
        files.forEach((file) => {
            const startFilePath = path.resolve(folderPath, file);
            const finalFilePath = path.resolve(copyFolderPath, file);
            fs.copyFile(startFilePath, finalFilePath);
        })
    }
    catch (err) {
        console.log('Error', err.message);
    }
}


copyDir()