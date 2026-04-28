import { fuoSubjectsBySemester } from './fuoSubjects';
import { hcm202Fa2024ReExam } from './hcm202Fa2024Re';
import { jpd123ExamDataById } from './jpd123ExamData';
import { mco201ExamDataById } from './mco201ExamData';
import { swt301ExamDataBySubject } from './swt301ExamData';
import { wdu203cExamDataById } from './wdu203cExamData';
import { prj301ExamDataById } from './prj301ExamData';

const allSubjects = [...new Set(Object.values(fuoSubjectsBySemester).flat())];

const createVariantBank = () => ({
  FE: [],
  PE: [],
});

export const fuoExamDataBySubject = Object.fromEntries(
  allSubjects.map((subject) => [subject, createVariantBank()])
);

fuoExamDataBySubject.CSI104.FE = [
  { id: 'fe-1', title: 'De FE 1', imageUrls: [] },
  { id: 'fe-2', title: 'De FE 2', imageUrls: [] },
];

fuoExamDataBySubject.CSI104.PE = [
  { id: 'pe-1', title: 'De PE 1', imageUrls: [] },
];

fuoExamDataBySubject.CEA201.FE = [
  { id: 'su-2024-fe', title: 'CEA201 - SU 2024 - FE', code: 'Ma de #001', imageUrls: [] },
  { id: 'fa25-re', title: 'CEA201 - FA25 - RE', code: 'Ma de #002', imageUrls: [] },
  { id: 'fa25-final-exam', title: 'CEA201 - FA25 - Final Exam', code: 'Ma de #003', imageUrls: [] },
  { id: 'su25-b5-1', title: 'CEA201 - SU25 - B5 - 1', code: 'Ma de #004', imageUrls: [] },
  { id: 'su25-retake-exam', title: 'CEA201 - SU25 - Retake Exam', code: 'Ma de #005', imageUrls: [] },
  { id: 'su25-final-exam', title: 'CEA201 - SU25 - Final Exam', code: 'Ma de #006', imageUrls: [] },
  { id: 'sp2025-fe', title: 'CEA201 - SP 2025 - FE', code: 'Ma de #007', imageUrls: [] },
  { id: 'pt2-sl2-su2025', title: 'CEA201 - PT2 - SL2 - SU 2025', code: 'Ma de #008', imageUrls: [] },
  { id: 'sp2025-re', title: 'CEA201 - SP 2025 - RE', code: 'Ma de #009', imageUrls: [] },
  { id: 'fa2024-fe', title: 'CEA201 - FA 2024 - FE', code: 'Ma de #010', imageUrls: [] },
  { id: 'fa2024-re', title: 'CEA201 - FA 2024 - RE', code: 'Ma de #011', imageUrls: [] },
  { id: 'su2024-re', title: 'CEA201 - SU 2024 - RE', code: 'Ma de #012', imageUrls: [] },
  { id: 'fa2023-re', title: 'CEA201 - FA 2023 - RE', code: 'Ma de #013', imageUrls: [] },
  { id: 'sp2024-re', title: 'CEA201 - SP 2024 - RE', code: 'Ma de #014', imageUrls: [] },
  { id: 'sp2024-fe-2', title: 'CEA201 - 2 - SP 2024 - FE', code: 'Ma de #015', imageUrls: [] },
  { id: 'sp2021c-fe', title: 'CEA201C1 - SP 2024 - FE', code: 'Ma de #016', imageUrls: [] },
  { id: 'fa2023-fe', title: 'CEA201 - FA 2023 - FE', code: 'Ma de #017', imageUrls: [] },
  { id: 'fa2022-fe-02', title: 'CEA201 - FA 2022 - FE - 02', code: 'Ma de #018', imageUrls: [] },
  { id: 'fa2022-fe-01', title: 'CEA201 - FA 2022 - FE - 01', code: 'Ma de #019', imageUrls: [] },
  { id: 'sp2023', title: 'CEA201 - SP 2023', code: 'Ma de #020', imageUrls: [] },
  { id: 'fe-su2023-1', title: 'CEA201 - 1 - SU 2023 - FE', code: 'Ma de #021', imageUrls: [] },
  { id: 'fe-su2023', title: 'CEA201 - FE - SU 2023', code: 'Ma de #022', imageUrls: [] },
  { id: 're-su2023', title: 'CEA201 - RE - SU 2023', code: 'Ma de #023', imageUrls: [] },
  { id: 'fe-su2023-6', title: 'CEA201 - 6 - SU 2023 - FE', code: 'Ma de #024', imageUrls: [] },
];

fuoExamDataBySubject.CEA201.PE = [];

fuoExamDataBySubject.HCM202.FE = [hcm202Fa2024ReExam];
fuoExamDataBySubject.HCM202.PE = [];

fuoExamDataBySubject.SWT301.FE = swt301ExamDataBySubject.SWT301.FE;
fuoExamDataBySubject.SWT301.PE = swt301ExamDataBySubject.SWT301.PE;

fuoExamDataBySubject.JDP123.FE = [
  { id: 'sp26-re', title: 'JPD123 - SP26 - RE', code: 'Ma de #001', imageUrls: [] },
  { id: 'sp26-c2fe', title: 'JPD123 - SP26 - C2FE', code: 'Ma de #002', imageUrls: [] },
  { id: 'sp26-c1fe', title: 'JPD123 - SP26 - C1FE', code: 'Ma de #003', imageUrls: [] },
  { id: 'fa25-re-mc', title: 'JDP123 - FA25 - RE - MC', code: 'Ma de #004', imageUrls: [] },
  { id: 'su25-b5-mc-fe', title: 'JDP123 - SU25 - B5 - MC - FE', code: 'Ma de #005', imageUrls: [] },
  { id: 'su25-re', title: 'JDP123 - SU25 - RE', code: 'Ma de #006', imageUrls: [] },
  { id: 'su25-final-exam', title: 'JDP123 - SU25 - Final Exam', code: 'Ma de #007', imageUrls: [] },
  { id: 'sp2025-fec2', title: 'JDP123 - SP 2025 - FEC2', code: 'Ma de #008', imageUrls: [] },
  { id: 'sp2025-re', title: 'JDP123 - SP 2025 - RE', code: 'Ma de #009', imageUrls: [] },
  { id: 'sp2025-fec1', title: 'JDP123 - SP 2025 - FEC1', code: 'Ma de #010', imageUrls: [] },
  { id: 'sp2024-rre', title: 'JPD123 - SP 2024 - RRE', code: 'Ma de #011', imageUrls: [] },
  { id: 'su2024-r-fe', title: 'JDP123 - SU 2024 - R - FE', code: 'Ma de #012', imageUrls: [] },
  { id: 'reading-sp2024-b5-fe', title: 'JDP123 - Reading - SP 2024 - Block 5 - FE', code: 'Ma de #013', imageUrls: [] },
  { id: 'su2024-r-re', title: 'JDP123 - SU 2024 - R - RE', code: 'Ma de #014', imageUrls: [] },
].map((exam) => {
  const examAssets = jpd123ExamDataById[exam.id] ?? {};
  return {
    ...exam,
    imageUrls: examAssets.imageUrls ?? exam.imageUrls,
    questionItems: examAssets.questionItems ?? exam.questionItems,
  };
});

fuoExamDataBySubject.JDP123.PE = [];

fuoExamDataBySubject.MCO201.FE = [
  { id: 'mco201c-sp-2025-fe', title: 'MCO201c - SP 2025 - FE', code: 'Ma de #001', imageUrls: [] },
  { id: 'mco201m-sp-2025-fe', title: 'MCO201m - SP 2025 - FE', code: 'Ma de #002', imageUrls: [] },
  { id: 'mco201m-fa-2024-fe', title: 'MCO201m - FA 2024 - FE', code: 'Ma de #003', imageUrls: [] },
  { id: 'mco201m-sp-2024-fe', title: 'MCO201m - SP 2024 - FE', code: 'Ma de #004', imageUrls: [] },
  { id: 'mco201m-fa-2023-re', title: 'MCO201m - FA 2023 - RE', code: 'Ma de #005', imageUrls: [] },
  { id: 'mco201m-fa-2023-fe', title: 'MCO201m - FA 2023 - FE', code: 'Ma de #006', imageUrls: [] },
  { id: 'mco201-fe-su-2023', title: 'MCO201 - FE - SU 2023', code: 'Ma de #007', imageUrls: [] },
].map((exam) => {
  const examAssets = mco201ExamDataById[exam.id] ?? {};
  return {
    ...exam,
    imageUrls: examAssets.imageUrls ?? exam.imageUrls,
    questionItems: examAssets.questionItems ?? exam.questionItems,
  };
});

fuoExamDataBySubject.MCO201.PE = [];

fuoExamDataBySubject.WDU203c.FE = [
  { id: 'sp-2025-fe', title: 'WDU203c - SP 2025 - FE', code: 'Ma de #001', imageUrls: [] },
  { id: 'fa25-fedn', title: 'WDU203c - FA25 - FEDN', code: 'Ma de #002', imageUrls: [] },
  { id: 'fa25-re', title: 'WDU203c - FA25 - RE', code: 'Ma de #003', imageUrls: [] },
  { id: 'su25-fe-1', title: 'WDU203c - SU25 - FE', code: 'Ma de #004', imageUrls: [] },
  { id: 'su25-re', title: 'WDU203c - SU25 - RE', code: 'Ma de #005', imageUrls: [] },
  { id: 'su-2024-fe', title: 'WDU203c - SU 2024 - FE', code: 'Ma de #006', imageUrls: [] },
  { id: 'fa-2024-fe', title: 'WDU203c - FA 2024 - FE', code: 'Ma de #007', imageUrls: [] },
  { id: 'su25-fe-2', title: 'WDU203c - SU25 - FE', code: 'Ma de #008', imageUrls: [] },
  { id: 'fa-2024-re', title: 'WDU203c - FA 2024 - RE', code: 'Ma de #009', imageUrls: [] },
  { id: 'su-2024-re', title: 'WDU203c - SU 2024 - RE', code: 'Ma de #010', imageUrls: [] },
  { id: 'sp-2025-re', title: 'WDU203c - SP 2025 - RE', code: 'Ma de #011', imageUrls: [] },
  { id: 'resp24', title: 'WDU203c - RESP24', code: 'Ma de #012', imageUrls: [] },
  { id: 'fesp24', title: 'WDU203c - FESP24', code: 'Ma de #013', imageUrls: [] },
  { id: 'fe-fa-2023', title: 'WDU203c - FE - FA 2023', code: 'Ma de #014', imageUrls: [] },
  { id: 'fe-su-2023', title: 'WDU203c - FE - SU 2023', code: 'Ma de #015', imageUrls: [] },
  { id: 're-fall2023', title: 'WDU203c - RE - FALL2023', code: 'Ma de #016', imageUrls: [] },
  { id: 'sp-2023-fe', title: 'WDU203c - SP 2023 - FE', code: 'Ma de #017', imageUrls: [] },
].map((exam) => {
  const examAssets = wdu203cExamDataById[exam.id] ?? {};
  return {
    ...exam,
    imageUrls: examAssets.imageUrls ?? exam.imageUrls,
    questionItems: examAssets.questionItems ?? exam.questionItems,
  };
});

fuoExamDataBySubject.WDU203c.PE = [];

fuoExamDataBySubject.PRF192.FE = [
  { id: 'fe-1', title: 'De FE 1', imageUrls: [] },
];

fuoExamDataBySubject.PRF192.PE = [
  { id: 'pe-1', title: 'De PE 1', imageUrls: [] },
];

fuoExamDataBySubject.PRJ301.FE = [
  { id: 'sp26-re', title: 'PRJ301 - SP26 - RE', code: 'Ma de #001', imageUrls: [] },
  { id: 'sp26-fe', title: 'PRJ301 - SP26 - FE', code: 'Ma de #002', imageUrls: [] },
  { id: 'fa25-feb5', title: 'PRJ301 - FA25 - FEB5', code: 'Ma de #003', imageUrls: [] },
  { id: 'fa25-final-exam', title: 'PRJ301 - FA25 - Final Exam', code: 'Ma de #004', imageUrls: [] },
  { id: 'su25-b5-re', title: 'PRJ301 - SU25 - B5 - RE', code: 'Ma de #005', imageUrls: [] },
  { id: 'su25-b5-1', title: 'PRJ301 - SU25 - B5 - 1', code: 'Ma de #006', imageUrls: [] },
  { id: 'su25-re', title: 'PRJ301 - SU25 - RE', code: 'Ma de #007', imageUrls: [] },
  { id: 'fa-2024-re', title: 'PRJ301 - FA 2024 - RE', code: 'Ma de #008', imageUrls: [] },
  { id: 'fa-2024-fe', title: 'PRJ301 - FA 2024 - FE', code: 'Ma de #009', imageUrls: [] },
  { id: 'sp-2025-re', title: 'PRJ301 - SP 2025 - RE', code: 'Ma de #010', imageUrls: [] },
  { id: 'reb5-fa-2023', title: 'PRJ301 - REB5 - FA 2023', code: 'Ma de #011', imageUrls: [] },
  { id: 'sp-2025-fe', title: 'PRJ301 - SP 2025 - FE', code: 'Ma de #012', imageUrls: [] },
  { id: 'sp-2025-block-5-1', title: 'PRJ301 - SP 2025 - Block 5 - 1', code: 'Ma de #013', imageUrls: [] },
  { id: 'sp-2025-block-5-2', title: 'PRJ301 - SP 2025 - Block 5 - 2', code: 'Ma de #014', imageUrls: [] },
  { id: 'su25-fe', title: 'PRJ301 - SU25 - FE', code: 'Ma de #015', imageUrls: [] },
].map((exam) => {
  const examAssets = prj301ExamDataById[exam.id] ?? {};
  return {
    ...exam,
    imageUrls: examAssets.imageUrls ?? exam.imageUrls,
    questionItems: examAssets.questionItems ?? exam.questionItems,
  };
});

fuoExamDataBySubject.PRJ301.PE = [];
