const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const { stdin, stdout } = process;
stdout.write('Hello, reviewer! Write something to the console.\n');
const output = fs.createWriteStream(filePath);

stdin.on('data', (data) => {
  if (data.toString().trim() == 'exit') {
    stdout.write('Thanks for visiting! Bye!');
    process.exit();
  }
  output.write(data);
});

process.on('SIGINT', () => {
  stdout.write('Thanks for visiting! Bye!');
  process.exit();
});
