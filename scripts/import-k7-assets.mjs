import fsPromises from 'node:fs/promises';
import path from 'node:path';

const workspaceRoot = process.cwd();
const kì7Root = 'G:/TẢi xuóng/FUO/kì 7';
const subjects = ['MMA301', 'PMG201c', 'SDN302', 'SWD392'];

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

const extractLeadingNumber = (name) => {
  const match = String(name).match(/^(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
};

const readRecursiveFiles = async (dir) => {
  const entries = await fsPromises.readdir(dir, { withFileTypes: true });
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
  await fsPromises.mkdir(dir, { recursive: true });
};

const main = async () => {
  for (const subject of subjects) {
    const sourceRoot = path.join(kì7Root, subject, 'FE');
    const sourceExists = await fsPromises
      .access(sourceRoot)
      .then(() => true)
      .catch(() => false);

    if (!sourceExists) {
      console.warn(`Source folder not found for ${subject}: ${sourceRoot}`);
      continue;
    }

    const publicBase = path.join(workspaceRoot, 'public', 'fuo', subject.toLowerCase());
    const outputDataFile = path.join(workspaceRoot, 'src', 'data', `${subject.toLowerCase()}ExamData.js`);

    await ensureDir(publicBase);

    const rootEntries = await fsPromises.readdir(sourceRoot, { withFileTypes: true });
    const examDirs = rootEntries
      .filter((entry) => entry.isDirectory())
      .sort((a, b) => extractLeadingNumber(a.name) - extractLeadingNumber(b.name));

    const assetsById = {};

    for (const folder of examDirs) {
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
      const answers = answerTxt ? parseTopAnswers(await fsPromises.readFile(answerTxt, 'utf8')) : [];

      // Parse ID and Title from folder name
      let cleanName = folder.name.replace(/^\d+[_-\s]*/, ''); // strip index prefix
      cleanName = cleanName.replace(/^(Đề\s+Thi\s+(FE|PE|Final\s+Exam)?\s*)/i, ''); // strip "Đề Thi FE "
      cleanName = cleanName.replace(/_/g, ' - ').replace(/\s*-\s*/g, ' - ').trim();

      let title = cleanName;
      if (!title.toLowerCase().startsWith(subject.toLowerCase())) {
        title = `${subject} - ${title}`;
      }

      // strip subject code from ID
      const subjectBase = subject.replace(/[cm]$/i, '');
      let id = title.replace(new RegExp('^' + subjectBase + '[cm]?\\s*-\\s*', 'i'), '');
      id = id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Check for empty or duplicates
      if (!id) {
        id = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      const targetFolder = path.join(publicBase, id);
      await ensureDir(targetFolder);

      const imageUrls = [];
      const questionItems = [];

      for (let imageIndex = 0; imageIndex < imageFiles.length; imageIndex += 1) {
        const sourceImage = imageFiles[imageIndex];
        const fileName = path.basename(sourceImage);
        const targetImage = path.join(targetFolder, fileName);
        await fsPromises.copyFile(sourceImage, targetImage);

        const imageUrl = `/fuo/${subject.toLowerCase()}/${id}/${fileName}`;
        imageUrls.push(imageUrl);
        questionItems.push({
          questionNumber: imageIndex + 1,
          imageUrl,
          answer: answers[imageIndex] ?? '',
        });
      }

      assetsById[id] = {
        title,
        sourceFolder: folder.name,
        imageUrls,
        questionItems,
      };
    }

    const output = `export const ${subject.toLowerCase()}ExamDataById = ${JSON.stringify(assetsById, null, 2)};\n`;
    await fsPromises.writeFile(outputDataFile, output, 'utf8');

    console.log(`Imported ${Object.keys(assetsById).length} exams for ${subject} to ${outputDataFile}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
