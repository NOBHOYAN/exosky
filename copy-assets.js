import { copyFile, mkdir } from 'fs/promises';
import { join } from 'path';

const foldersToCopy = ['HTML', 'CSS', 'js', 'json'];
const destDir = 'dist';

async function copyFolder(folder) {
  const destFolder = join(destDir, folder.toLowerCase());
  await mkdir(destFolder, { recursive: true });
  const files = await fs.promises.readdir(folder);

  for (const file of files) {
    await copyFile(join(folder, file), join(destFolder, file));
  }
}

async function copyAssets() {
  for (const folder of foldersToCopy) {
    await copyFolder(folder);
  }
  console.log('Assets copied successfully.');
}

copyAssets().catch(console.error);
