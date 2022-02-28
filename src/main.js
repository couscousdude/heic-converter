const fs = require('fs/promises');
const convert = require('heic-convert');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const convertToPng = async (filePath) => {
    const inputBuffer = await fs.readFile(filePath);
    return convert({
      buffer: inputBuffer, // the HEIC file buffer
      format: 'PNG'        // output format
    });
  };

const convertInFolder = async (dirPath, destination) => {
    try {
        await resetDestinationFolder(destination);
        const files = await fs.readdir(dirPath);
        console.log(`Converting: ${files}`);

        for (const file of files) {
            const convertedPNG = await convertToPng(path.join(dirPath, file));
            await fs.writeFile(path.join(destination, file.replace(/\.HEIC/, '.png')), convertedPNG);
            console.log(convertedPNG);
        }

        console.log("File Conversion Completed. Check the result directory.");
    } catch {
        throw new Error("Something went wrong converting/reading that directory. Try again.");
    } finally {
        rl.close();
    }
}

const resetDestinationFolder = async destination => {
    const files = await fs.readdir(destination);
    console.log(files)

    for (const file of files) {
        await fs.unlink(path.join(destination, file));
    }
}

const main = () => {
    rl.question('Input file path: ', dirPath => {
        rl.question('Input destination path (WARNING: this folder will be wiped completely! DOUBLE CHECK the path): ', destination => {
            convertInFolder(dirPath, destination);
        });
    });
}

main();