import fs from 'node:fs/promises';
import path from 'node:path';

const workspaceRoot = process.cwd();
const sourceRoot = 'G:/TẢi xuóng/src jpd123/src jpd123/JPD123';
const publicBase = path.join(workspaceRoot, 'public', 'fuo', 'jpd123');
const outputDataFile = path.join(workspaceRoot, 'src', 'data', 'jpd123ExamData.js');

const examDefinitions = [
  { id: 'sp26-re', title: 'JPD123 - SP26 - RE' },
  { id: 'sp26-c2fe', title: 'JPD123 - SP26 - C2FE' },
  { id: 'sp26-c1fe', title: 'JPD123 - SP26 - C1FE' },
  { id: 'fa25-re-mc', title: 'JDP123 - FA25 - RE - MC' },
  { id: 'su25-b5-mc-fe', title: 'JDP123 - SU25 - B5 - MC - FE' },
  { id: 'su25-re', title: 'JDP123 - SU25 - RE' },
  { id: 'su25-final-exam', title: 'JDP123 - SU25 - Final Exam' },
  { id: 'sp2025-fec2', title: 'JDP123 - SP 2025 - FEC2' },
  { id: 'sp2025-re', title: 'JDP123 - SP 2025 - RE' },
  { id: 'sp2025-fec1', title: 'JDP123 - SP 2025 - FEC1' },
  { id: 'sp2024-rre', title: 'JPD123 - SP 2024 - RRE' },
  { id: 'su2024-r-fe', title: 'JDP123 - SU 2024 - R - FE' },
  { id: 'reading-sp2024-b5-fe', title: 'JDP123 - Reading - SP 2024 - Block 5 - FE' },
  { id: 'su2024-r-re', title: 'JDP123 - SU 2024 - R - RE' },
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

const parseTopAnswers = (text) => {
  const answers = [];
  const answerRegex = /Top:\s*([^\r\n]+?)\s*->/gu;

  for (const match of text.matchAll(answerRegex)) {
    answers.push(normalizeAnswer(match[1]));
  }

  return answers;
};

const sanitizeAnswer = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
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

const stripSourcePrefix = (name) => name.replace(/^\d+[_\s-]*/, '').trim();

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

  if (examDirs.length < examDefinitions.length) {
    throw new Error(`Expected at least ${examDefinitions.length} exam folders, found ${examDirs.length}.`);
  }

  const assetsById = {};

  for (let index = 0; index < examDefinitions.length; index += 1) {
    const exam = examDefinitions[index];
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
    const answers = answerTxt ? parseTopAnswers(await fs.readFile(answerTxt, 'utf8')) : [];

    const targetFolder = path.join(publicBase, exam.id);
    await ensureDir(targetFolder);

    const imageUrls = [];
    const questionItems = [];

    for (let imageIndex = 0; imageIndex < imageFiles.length; imageIndex += 1) {
      const sourceImage = imageFiles[imageIndex];
      const fileName = path.basename(sourceImage);
      const targetImage = path.join(targetFolder, fileName);
      await fs.copyFile(sourceImage, targetImage);

      const imageUrl = `/fuo/jpd123/${exam.id}/${fileName}`;
      imageUrls.push(imageUrl);
      const answer = sanitizeAnswer(answers[imageIndex]);
      questionItems.push({
        questionNumber: imageIndex + 1,
        imageUrl,
        answer,
        answerNote: answer ? null : 'Chua co dap an ro rang',
      });
    }

    assetsById[exam.id] = {
      sourceFolder: stripSourcePrefix(folder.name),
      imageUrls,
      questionItems,
    };
  }

  const output = `export const jpd123ExamDataById = ${JSON.stringify(assetsById, null, 2)};\n`;
  await fs.writeFile(outputDataFile, output, 'utf8');

  console.log(`Imported ${Object.keys(assetsById).length} exams to ${outputDataFile}`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
