const { match } = require("assert");
const { readdir } = require("fs/promises");
const path = require("path");

function execShellCommand(cmd) {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

function getFileId(filename) {
  return filename.replace(/\..+$/, "");
}

async function findByName(dir, name) {
  let matchedFiles;

  const files = await readdir(dir);
  for (const file of files) {
    // Method 1:
    const filename = path.parse(file).name;
    if (filename == name) {
      matchedFiles = file;
      break;
    }
  }

  return matchedFiles;
}

async function findFiles(dir) {
  let matchedFiles = [];

  const files = await readdir(dir);
  for (const file of files) {
    matchedFiles.push(file);
  }

  return matchedFiles;
}

module.exports = {
  findByName,
  findFiles,
  getFileId,
  execShellCommand,
};
