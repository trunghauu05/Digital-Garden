import fs from 'node:fs/promises';
import path from 'node:path';

const workspaceRoot = process.cwd();
const sourceRoot = 'G:/TẢi xuóng/FUO/kì 5/WDU203c';
const publicBase = path.join(workspaceRoot, 'public', 'fuo', 'wdu203c');
const outputDataFile = path.join(workspaceRoot, 'src', 'data', 'wdu203cExamData.js');

const examIdsByOrder = [
  'sp-2025-fe',
  'fa25-fedn',
  'fa25-re',
  'su25-fe-1',
  'su25-re',
  'su-2024-fe',
  'fa-2024-fe',
  'su25-fe-2',
  'fa-2024-re',
  'su-2024-re',
  'sp-2025-re',
  'resp24',
  'fesp24',
  'fe-fa-2023',
  'fe-su-2023',
  're-fall2023',
  'sp-2023-fe',
];

const IMAGE_EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg']);

const normalizeAnswer = (raw) => {
  if (!raw) return '';
  return raw
    .replace(/\s+/g, '')
    .replace(/\u2192/g, '')
    .replace(/[。．]/g, '.')
    .toUpperCase();
};

const parseMajorityAnswers = (text) => {
  const answers = [];
  const answerRegex = /Đáp án nhiều nhất:\s*(.+?)\s*→/gu;
  for (const match of text.matchAll(answerRegex)) {
    answers.push(normalizeAnswer(match[1]));
  }

  if (answers.length === 0) {
    const fallbackRegex = /Dap an nhieu nhat:\s*(.+?)\s*->/giu;
    for (const match of text.matchAll(fallbackRegex)) {
      answers.push(normalizeAnswer(match[1]));
    }
  }

  return answers;
};

const extractLeadingNumber = (name) => {
  const match = String(name).match(/^(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
};

const readRecursiveFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await readRecursiveFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
};

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

const main = async () => {
  const sourceExists = await fs
    .access(sourceRoot)
    .then(() => true)
    .catch(() => false);

  if (!sourceExists) {
    throw new Error(`Source folder not found: ${sourceRoot}`);
  }

  await ensureDir(publicBase);

  const rootEntries = await fs.readdir(sourceRoot, { withFileTypes: true });
  const examDirs = rootEntries
    .filter((entry) => entry.isDirectory())
    .sort((a, b) => extractLeadingNumber(a.name) - extractLeadingNumber(b.name));

  if (examDirs.length < examIdsByOrder.length) {
    throw new Error(`Expected at least ${examIdsByOrder.length} exam folders, found ${examDirs.length}.`);
  }

  const assetsById = {};

  for (let index = 0; index < examIdsByOrder.length; index += 1) {
    const examId = examIdsByOrder[index];
    const folder = examDirs[index];
    const folderPath = path.join(sourceRoot, folder.name);

    const allFiles = await readRecursiveFiles(folderPath);
    const imageFiles = allFiles
      .filter((filePath) => IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase()))
      .sort((left, right) => {
        const leftName = path.basename(left);
        const rightName = path.basename(right);
        const diff = extractLeadingNumber(leftName) - extractLeadingNumber(rightName);
        if (diff !== 0) return diff;
        return leftName.localeCompare(rightName);
      });

    const answerTxt = allFiles.find((filePath) => path.extname(filePath).toLowerCase() === '.txt');
    const answers = answerTxt
      ? parseMajorityAnswers(await fs.readFile(answerTxt, 'utf8'))
      : [];

    const targetFolder = path.join(publicBase, examId);
    await ensureDir(targetFolder);

    const imageUrls = [];
    const questionItems = [];

    for (let i = 0; i < imageFiles.length; i += 1) {
      const sourceImage = imageFiles[i];
      const fileName = path.basename(sourceImage);
      const targetImage = path.join(targetFolder, fileName);
      await fs.copyFile(sourceImage, targetImage);

      const imageUrl = `/fuo/wdu203c/${examId}/${fileName}`;
      imageUrls.push(imageUrl);
      questionItems.push({
        questionNumber: i + 1,
        imageUrl,
        answer: answers[i] ?? '',
      });
    }

    assetsById[examId] = {
      sourceFolder: folder.name,
      imageUrls,
      questionItems,
    };
  }

  const output = `export const wdu203cExamDataById = ${JSON.stringify(assetsById, null, 2)};\n`;
  await fs.writeFile(outputDataFile, output, 'utf8');

  console.log(`Imported ${Object.keys(assetsById).length} exams to ${outputDataFile}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
