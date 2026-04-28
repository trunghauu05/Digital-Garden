import fs from 'node:fs/promises';
import path from 'node:path';

const workspaceRoot = process.cwd();
const publicBase = path.join(workspaceRoot, 'public', 'fuo', 'prj301');
const outputDataFile = path.join(workspaceRoot, 'src', 'data', 'prj301ExamData.js');

const examDefinitions = [
  { id: 'sp26-re', folder: 'thi-fe-prj301-sp26-re', title: 'PRJ301 - SP26 - RE' },
  { id: 'sp26-fe', folder: 'thi-fe-prj301-sp26-fe', title: 'PRJ301 - SP26 - FE' },
  { id: 'fa25-feb5', folder: 'thi-fe-prj301-fa25-feb5', title: 'PRJ301 - FA25 - FEB5' },
  { id: 'fa25-final-exam', folder: 'thi-fe-prj301-fa25-final-exam', title: 'PRJ301 - FA25 - Final Exam' },
  { id: 'su25-b5-re', folder: 'thi-fe-prj301-su25-b5-re', title: 'PRJ301 - SU25 - B5 - RE' },
  { id: 'su25-b5-1', folder: 'thi-fe-prj301-su25-b5-1', title: 'PRJ301 - SU25 - B5 - 1' },
  { id: 'su25-re', folder: 'thi-fe-prj301-su25-re', title: 'PRJ301 - SU25 - RE' },
  { id: 'fa-2024-re', folder: 'thi-fe-prj301-fa-2024-re', title: 'PRJ301 - FA 2024 - RE' },
  { id: 'fa-2024-fe', folder: 'thi-fe-prj301-fa-2024-fe', title: 'PRJ301 - FA 2024 - FE' },
  { id: 'sp-2025-re', folder: 'thi-fe-prj301-sp-2025-re', title: 'PRJ301 - SP 2025 - RE' },
  { id: 'reb5-fa-2023', folder: 'thi-fe-prj301-reb5-fa-2023', title: 'PRJ301 - REB5 - FA 2023' },
  { id: 'sp-2025-fe', folder: 'thi-fe-prj301-sp-2025-fe', title: 'PRJ301 - SP 2025 - FE' },
  { id: 'sp-2025-block-5-1', folder: 'thi-fe-prj301-sp-2025-block-5-1', title: 'PRJ301 - SP 2025 - Block 5 - 1' },
  { id: 'sp-2025-block-5-2', folder: 'thi-fe-prj301-sp-2025-block-5-2', title: 'PRJ301 - SP 2025 - Block 5 - 2' },
  { id: 'su25-fe', folder: 'thi-fe-prj301-su25-fe', title: 'PRJ301 - SU25 - FE' },
];

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

const readRecursiveFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await readRecursiveFiles(fullPath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
};

const main = async () => {
  const sourceExists = await fs
    .access(publicBase)
    .then(() => true)
    .catch(() => false);

  if (!sourceExists) {
    throw new Error(`Source folder not found: ${publicBase}`);
  }

  const assetsById = {};

  for (const exam of examDefinitions) {
    const folderPath = path.join(publicBase, exam.folder);
    const folderExists = await fs
      .access(folderPath)
      .then(() => true)
      .catch(() => false);

    if (!folderExists) {
      throw new Error(`Exam folder not found: ${folderPath}`);
    }

    const allFiles = await readRecursiveFiles(folderPath);
    const imageFiles = allFiles
      .filter((filePath) => IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase()))
      .sort((left, right) => path.basename(left).localeCompare(path.basename(right), 'en', { numeric: true }));

    const answerTxt = allFiles.find((filePath) => path.extname(filePath).toLowerCase() === '.txt');
    const answers = answerTxt ? parseTopAnswers(await fs.readFile(answerTxt, 'utf8')) : [];

    const questionItems = imageFiles.map((sourceImage, imageIndex) => {
      const fileName = path.basename(sourceImage);
      const imageUrl = `/fuo/prj301/${exam.folder}/${fileName}`;
      const answer = sanitizeAnswer(answers[imageIndex]);

      return {
        questionNumber: imageIndex + 1,
        imageUrl,
        answer,
        answerNote: answer ? null : 'Chua co dap an ro rang',
      };
    });

    assetsById[exam.id] = {
      sourceFolder: exam.folder,
      imageUrls: questionItems.map((item) => item.imageUrl),
      questionItems,
    };
  }

  const output = `export const prj301ExamDataById = ${JSON.stringify(assetsById, null, 2)};\n`;
  await fs.writeFile(outputDataFile, output, 'utf8');

  console.log(`Imported ${Object.keys(assetsById).length} exams to ${outputDataFile}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});