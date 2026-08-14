import fs from 'node:fs/promises';
import path from 'node:path';

const workspaceRoot = process.cwd();
const sourceBase = 'G:\\EMW493c';
const publicBase = path.join(workspaceRoot, 'public', 'fuo', 'enw493c');
const outputDataFile = path.join(workspaceRoot, 'src', 'data', 'enw493cExamData.js');

const IMAGE_EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg']);

const normalizeAnswer = (raw) => {
  if (!raw) {
    return null;
  }

  const normalized = raw
    .replace(/\s+/g, '')
    .replace(/[\u2192]/g, '')
    .toUpperCase();

  return normalized || null;
};

const parseTopAnswers = (text) => {
  const answers = [];
  const answerRegex = /Top:\s*([^\r\n]+?)\s*->/gu;

  for (const match of text.matchAll(answerRegex)) {
    answers.push(normalizeAnswer(match[1]));
  }

  return answers;
};

const sanitizeAnswer = (value) => {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  return value.trim();
};

const main = async () => {
  // Check if source folder exists
  const sourceExists = await fs
    .access(sourceBase)
    .then(() => true)
    .catch(() => false);

  if (!sourceExists) {
    throw new Error(`Source folder not found: ${sourceBase}`);
  }

  // Create publicBase directory if it doesn't exist
  await fs.mkdir(publicBase, { recursive: true });

  const entries = await fs.readdir(sourceBase, { withFileTypes: true });
  const examFolders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const assetsById = {};

  for (const folderName of examFolders) {
    const srcFolderPath = path.join(sourceBase, folderName);
    const files = await fs.readdir(srcFolderPath);

    const imageFiles = files
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort((left, right) => left.localeCompare(right, 'en', { numeric: true }));

    if (imageFiles.length === 0) {
      console.log(`Skipping folder (no images): ${folderName}`);
      continue;
    }

    // Clean up folder name and build IDs
    // Example: "001_Đề Thi FE ENW493c - SP26 - FE" -> "SP26 - FE"
    const parts = folderName.split(' - ');
    if (parts.length < 2) {
      console.log(`Skipping folder (invalid pattern): ${folderName}`);
      continue;
    }
    const namePart = parts.slice(1).join(' - ').trim();
    const cleanId = namePart.toLowerCase().replace(/\s+/g, '-').replace(/-+/g, '-');
    const destFolderName = `thi-fe-enw493c-${cleanId}`;
    const destFolderPath = path.join(publicBase, destFolderName);

    let examTitle = `ENW493c - ${namePart}`;
    // Human-friendly titles for writing parts
    if (examTitle.endsWith(' - W')) {
      examTitle = examTitle.slice(0, -4) + ' - Writing';
    }

    console.log(`Processing: "${folderName}" -> folder: "${destFolderName}", id: "${cleanId}", title: "${examTitle}"`);

    // Ensure dest folder exists
    await fs.mkdir(destFolderPath, { recursive: true });

    // Copy image files and find comments txt file
    let commentsFileSrc = null;
    let commentsFileDest = null;

    for (const file of files) {
      const srcFilePath = path.join(srcFolderPath, file);
      const destFilePath = path.join(destFolderPath, file);

      if (IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase())) {
        await fs.copyFile(srcFilePath, destFilePath);
      } else if (file.startsWith('FUO_Comments_') && file.endsWith('.txt')) {
        commentsFileSrc = srcFilePath;
        commentsFileDest = destFilePath;
        await fs.copyFile(srcFilePath, destFilePath);
      }
    }

    // Parse answers
    const answers = commentsFileSrc
      ? parseTopAnswers(await fs.readFile(commentsFileSrc, 'utf8'))
      : [];

    const questionItems = imageFiles.map((fileName, imageIndex) => {
      const imageUrl = `/fuo/enw493c/${destFolderName}/${fileName}`;
      const answer = sanitizeAnswer(answers[imageIndex]);

      return {
        questionNumber: imageIndex + 1,
        imageUrl,
        answer,
        answerNote: answer ? null : 'Chua co dap an ro rang',
      };
    });

    assetsById[cleanId] = {
      title: examTitle,
      sourceFolder: destFolderName,
      imageUrls: questionItems.map((item) => item.imageUrl),
      questionItems,
    };
  }

  const output = `export const enw493cExamDataById = ${JSON.stringify(assetsById, null, 2)};\n`;
  await fs.writeFile(outputDataFile, output, 'utf8');

  console.log(`Imported ${Object.keys(assetsById).length} exams to ${outputDataFile}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
