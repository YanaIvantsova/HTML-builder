const fs = require('fs/promises');
const path = require('path');

const componentsDir = path.resolve(__dirname, 'components');
const templatePath = path.resolve(__dirname, 'template.html');
const distDir = path.resolve(__dirname, 'project-dist');
const htmlPath = path.resolve(distDir, 'index.html');
const assetsDirPath = path.resolve(__dirname, 'assets');
const copyAssetsDirPath = path.resolve(distDir, 'assets');
const cssPath = path.resolve(__dirname, 'styles');
const bundlePath = path.resolve(__dirname, 'project-dist', 'style.css');
const htmlExt = '.html';


async function readTemplate() {
    try {
        const templateContent = await fs.readFile(templatePath, 'utf-8');
        return templateContent;
    } catch (err) {
        throw new Error(`Error reading template: ${err.message}`);
    }
}

async function readComponent(componentsPath) {
    try {
        const files = await fs.readdir(componentsPath, { withFileTypes: true });
        return files.filter(file => file.isFile() && path.extname(file.name) === htmlExt);
    } catch (err) {
        throw new Error(`Error reading component files: ${err.message}`);
    }
}

async function processComponent(filePath, htmlContent) {
    try {
        const componentName = path.parse(filePath).name;
        const data = await fs.readFile(filePath, 'utf-8');
        return htmlContent.replaceAll(`{{${componentName}}}`, data);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

async function checkDirectory(directoryPath) {
    try {
        await fs.mkdir(directoryPath, { recursive: true });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

async function build() {
    try {
        await checkDirectory(distDir);

        const templateContent = await readTemplate();
        const componentFiles = await readComponent(componentsDir);
        let htmlContent = templateContent;
        for (const file of componentFiles) {
            const filePath = path.join(componentsDir, file.name);
            htmlContent = await processComponent(filePath, htmlContent);
        }

        await fs.writeFile(htmlPath, htmlContent);
        console.log('Successfully generated index.html');
    } catch (err) {
        console.error('Error:', err.message);
    }
    await copyDir(assetsDirPath, copyAssetsDirPath);
    await copyCss(cssPath, bundlePath);
}


async function copyDir(from, to) {
    try {
        await fs.mkdir(to, { recursive: true });
        const files = await fs.readdir(from, { withFileTypes: true });
        for (const file of files) {
            const fromPath = path.resolve(from, file.name);
            const toPath = path.resolve(to, file.name);
            if (file.isDirectory()) {
                await copyDir(fromPath, toPath);
            } else {
                await fs.copyFile(fromPath, toPath);
            }
        }
        console.log('Folder copied successfully!');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

async function copyCss(folderPath, outputPath) {
    try {
        const files = await fs.readdir(folderPath, { withFileTypes: true });

        const cssFiles = files.filter((file) => {
            return file.isFile() && path.extname(file.name) === '.css';
        });

        for (const file of cssFiles) {
            const inputPath = path.join(folderPath, file.name);
            const inputContent = await fs.readFile(inputPath, 'utf-8');
            await fs.writeFile(outputPath, inputContent, { flag: 'a' });
        }
        console.log('CSS files copied successfully.');
    } catch (err) {
        console.error('Error:', err.message);
    }
}


build();
