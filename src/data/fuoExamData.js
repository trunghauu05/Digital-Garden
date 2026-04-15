import { fuoSubjectsBySemester } from './fuoSubjects';
import { hcm202Fa2024ReExam } from './hcm202Fa2024Re';
import { mco201ExamDataById } from './mco201ExamData';
import { swt301ExamDataBySubject } from './swt301ExamData';
import { wdu203cExamDataById } from './wdu203cExamData';

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
  {
    id: 'fa25-re-mc',
    title: 'JDP123 - FA25 - RE - MC',
    code: 'JPD123_FA25_RE_MC_5564',
    imageUrls: [
      'https://fuoverflow.com/attachments/28-webp.241431/',
      'https://fuoverflow.com/attachments/1-webp.241404/',
      'https://fuoverflow.com/attachments/2-webp.241405/',
      'https://fuoverflow.com/attachments/3-webp.241406/',
      'https://fuoverflow.com/attachments/4-webp.241407/',
      'https://fuoverflow.com/attachments/5-webp.241408/',
      'https://fuoverflow.com/attachments/6-webp.241409/',
      'https://fuoverflow.com/attachments/7-webp.241410/',
      'https://fuoverflow.com/attachments/8-webp.241411/',
      'https://fuoverflow.com/attachments/9-webp.241412/',
      'https://fuoverflow.com/attachments/10-webp.241413/',
      'https://fuoverflow.com/attachments/11-webp.241414/',
      'https://fuoverflow.com/attachments/12-webp.241415/',
      'https://fuoverflow.com/attachments/13-webp.241416/',
      'https://fuoverflow.com/attachments/14-webp.241417/',
      'https://fuoverflow.com/attachments/15-webp.241418/',
      'https://fuoverflow.com/attachments/16-webp.241419/',
      'https://fuoverflow.com/attachments/17-webp.241420/',
      'https://fuoverflow.com/attachments/18-webp.241421/',
      'https://fuoverflow.com/attachments/19-webp.241422/',
      'https://fuoverflow.com/attachments/20-webp.241423/',
      'https://fuoverflow.com/attachments/21-webp.241424/',
      'https://fuoverflow.com/attachments/22-webp.241425/',
      'https://fuoverflow.com/attachments/23-webp.241426/',
      'https://fuoverflow.com/attachments/24-webp.241427/',
      'https://fuoverflow.com/attachments/25-webp.241428/',
      'https://fuoverflow.com/attachments/26-webp.241429/',
      'https://fuoverflow.com/attachments/27-webp.241430/',
      'https://fuoverflow.com/attachments/29-webp.241432/',
      'https://fuoverflow.com/attachments/30-webp.241433/',
    ],
    questionItems: [
      { questionNumber: 1, imageUrl: 'https://fuoverflow.com/attachments/28-webp.241431/', answer: 'C' },
      { questionNumber: 2, imageUrl: 'https://fuoverflow.com/attachments/1-webp.241404/', answer: 'D' },
      { questionNumber: 3, imageUrl: 'https://fuoverflow.com/attachments/2-webp.241405/', answer: 'A' },
      { questionNumber: 4, imageUrl: 'https://fuoverflow.com/attachments/3-webp.241406/', answer: 'B' },
      { questionNumber: 5, imageUrl: 'https://fuoverflow.com/attachments/4-webp.241407/', answer: 'B' },
      { questionNumber: 6, imageUrl: 'https://fuoverflow.com/attachments/5-webp.241408/', answer: 'C' },
      { questionNumber: 7, imageUrl: 'https://fuoverflow.com/attachments/6-webp.241409/', answer: 'C' },
      { questionNumber: 8, imageUrl: 'https://fuoverflow.com/attachments/7-webp.241410/', answer: 'B' },
      { questionNumber: 9, imageUrl: 'https://fuoverflow.com/attachments/8-webp.241411/', answer: 'C' },
      { questionNumber: 10, imageUrl: 'https://fuoverflow.com/attachments/9-webp.241412/', answer: 'D' },
      { questionNumber: 11, imageUrl: 'https://fuoverflow.com/attachments/10-webp.241413/', answer: 'C' },
      { questionNumber: 12, imageUrl: 'https://fuoverflow.com/attachments/11-webp.241414/', answer: 'B' },
      { questionNumber: 13, imageUrl: 'https://fuoverflow.com/attachments/12-webp.241415/', answer: 'A' },
      { questionNumber: 14, imageUrl: 'https://fuoverflow.com/attachments/13-webp.241416/', answer: 'C' },
      { questionNumber: 15, imageUrl: 'https://fuoverflow.com/attachments/14-webp.241417/', answer: 'A' },
      { questionNumber: 16, imageUrl: 'https://fuoverflow.com/attachments/15-webp.241418/', answer: 'C' },
      { questionNumber: 17, imageUrl: 'https://fuoverflow.com/attachments/16-webp.241419/', answer: 'B' },
      { questionNumber: 18, imageUrl: 'https://fuoverflow.com/attachments/17-webp.241420/', answer: 'D' },
      { questionNumber: 19, imageUrl: 'https://fuoverflow.com/attachments/18-webp.241421/', answer: 'A' },
      { questionNumber: 20, imageUrl: 'https://fuoverflow.com/attachments/19-webp.241422/', answer: 'C' },
      { questionNumber: 21, imageUrl: 'https://fuoverflow.com/attachments/20-webp.241423/', answer: 'D' },
      { questionNumber: 22, imageUrl: 'https://fuoverflow.com/attachments/21-webp.241424/', answer: 'A' },
      { questionNumber: 23, imageUrl: 'https://fuoverflow.com/attachments/22-webp.241425/', answer: 'A' },
      { questionNumber: 24, imageUrl: 'https://fuoverflow.com/attachments/23-webp.241426/', answer: 'B' },
      { questionNumber: 25, imageUrl: 'https://fuoverflow.com/attachments/24-webp.241427/', answer: 'A' },
      { questionNumber: 26, imageUrl: 'https://fuoverflow.com/attachments/25-webp.241428/', answer: 'A' },
      { questionNumber: 27, imageUrl: 'https://fuoverflow.com/attachments/26-webp.241429/', answer: 'B' },
      { questionNumber: 28, imageUrl: 'https://fuoverflow.com/attachments/27-webp.241430/', answer: 'C' },
      { questionNumber: 29, imageUrl: 'https://fuoverflow.com/attachments/29-webp.241432/', answer: 'D' },
      { questionNumber: 30, imageUrl: 'https://fuoverflow.com/attachments/30-webp.241433/', answer: 'A' },
    ],
  },
  { id: 'su25-b5-mc-fe', title: 'JDP123 - SU25 - B5 - MC - FE', code: 'Ma de #002', imageUrls: [] },
  { id: 'su25-re', title: 'JDP123 - SU25 - RE', code: 'Ma de #003', imageUrls: [] },
  { id: 'su25-final-exam', title: 'JDP123 - SU25 - Final Exam', code: 'Ma de #004', imageUrls: [] },
  { id: 'sp2025-fec2', title: 'JDP123 - SP 2025 - FEC2', code: 'Ma de #005', imageUrls: [] },
  { id: 'sp2025-re', title: 'JDP123 - SP 2025 - RE', code: 'Ma de #006', imageUrls: [] },
  { id: 'sp2025-fec1', title: 'JDP123 - SP 2025 - FEC1', code: 'Ma de #007', imageUrls: [] },
  { id: 'sp2024-pre', title: 'JDP123 - SP 2024 - PRE', code: 'Ma de #008', imageUrls: [] },
  { id: 'su2024-r-fe', title: 'JDP123 - SU 2024 - R - FE', code: 'Ma de #009', imageUrls: [] },
  { id: 'reading-sp2024-b5-fe', title: 'JDP123 - Reading - SP 2024 - Block 5 - FE', code: 'Ma de #010', imageUrls: [] },
  { id: 'su2024-r-re', title: 'JDP123 - SU 2024 - R - RE', code: 'Ma de #011', imageUrls: [] },
  { id: 'su2024-b5-fe-r', title: 'JDP123 - SU 2024 - Block 5 - FE - R', code: 'Ma de #012', imageUrls: [] },
  { id: 'fa2024-fe', title: 'JDP123 - FA 2024 - FE', code: 'Ma de #013', imageUrls: [] },
  { id: 'fa2024-b5-fe', title: 'JDP123 - FA 2024 - Block 5 - FE', code: 'Ma de #014', imageUrls: [] },
  { id: 'sp2024-2-rfe', title: 'JDP123 - 2 - SP 2024 - RFE', code: 'Ma de #015', imageUrls: [] },
  { id: 'su2024-b5-fe-l', title: 'JDP123 - SU 2024 - Block 5 - FE - L', code: 'Ma de #016', imageUrls: [] },
  { id: 'su2024-l-re', title: 'JDP123 - SU 2024 - L - RE', code: 'Ma de #017', imageUrls: [] },
  { id: 'su2024-l-fe', title: 'JDP123 - SU 2024 - L - FE', code: 'Ma de #018', imageUrls: [] },
  { id: 'sp2024-2-lfe', title: 'JDP123 - 2 - SP 2024 - LFE', code: 'Ma de #019', imageUrls: [] },
  { id: 'fa2023-re-r', title: 'JDP123 - FA 2023 - RE - R', code: 'Ma de #020', imageUrls: [] },
  { id: 'sp2024-1-lfe', title: 'JDP123 - 1 - SP 2024 - LFE', code: 'Ma de #021', imageUrls: [] },
  { id: 'sp2024-lre', title: 'JDP123 - SP 2024 - LRE', code: 'Ma de #022', imageUrls: [] },
  { id: 'jdp123c1-sp2024-rfe', title: 'JDP123C1 - SP 2024 - RFE', code: 'Ma de #023', imageUrls: [] },
  { id: 'su2023-b5-r-fe', title: 'JDP123 - SU 2023 - Block 5 - R - FE', code: 'Ma de #024', imageUrls: [] },
  { id: 'listening-sp2024-b5-fe', title: 'JDP123 - Listening - SP 2024 - Block 5 - FE', code: 'Ma de #025', imageUrls: [] },
  { id: 'su23hcm-mc', title: 'JDP123 - SU23HCM - MC', code: 'Ma de #026', imageUrls: [] },
  { id: 're-fa2022', title: 'JDP123 - RE - FA 2022', code: 'Ma de #027', imageUrls: [] },
  { id: 'su2023-b5-r-re', title: 'JDP123 - SU 2023 - Block 5 - R - RE', code: 'Ma de #028', imageUrls: [] },
  { id: 'fa2023-r-fe', title: 'JDP123 - FA 2023 - R - FE', code: 'Ma de #029', imageUrls: [] },
  { id: 'block5-r-fall2023', title: 'JDP123 - Block 5 - R - FALL2023', code: 'Ma de #030', imageUrls: [] },
  { id: 'feb5-r-fa2023', title: 'JDP123 - FEB5 - R - FA 2023', code: 'Ma de #031', imageUrls: [] },
  { id: 'feb5-l-fa2023', title: 'JDP123 - FEB5 - L - FA 2023', code: 'Ma de #032', imageUrls: [] },
  { id: 'su2023-l-2ndfe', title: 'JDP123 - SU 2023 - L - 2ndFE (Co file nghe)', code: 'Ma de #033', imageUrls: [] },
  { id: 'fa2023-re-l', title: 'JDP123 - FA 2023 - RE - L', code: 'Ma de #034', imageUrls: [] },
  { id: 'fa2023-l-fe', title: 'JDP123 - FA 2023 - L - FE', code: 'Ma de #035', imageUrls: [] },
  { id: 'su2023-r-re', title: 'JDP123 - SU 2023 - R - RE', code: 'Ma de #036', imageUrls: [] },
  { id: 'su2023-r-fe-slot2', title: 'JDP123 - SU 2023 - R - FE - 29764 Slot 2', code: 'Ma de #037', imageUrls: [] },
  { id: 'fa2022-fe-hola-slot2', title: 'JDP123 - FA 2022 - FE (Hola Slot 2)', code: 'Ma de #038', imageUrls: [] },
  { id: 'sp2023-re-fuda-slot4', title: 'JDP123 - SP 2023 - RE (Fuda Slot 4)', code: 'Ma de #039', imageUrls: [] },
  { id: 'sp2022-fe-b5-hcm-slot6', title: 'JDP123 - SP 2022 - FE - Block5 (HCM Slot 6)', code: 'Ma de #040', imageUrls: [] },
  { id: 'sp2023-re', title: 'JDP123 - SP 2023 - RE', code: 'Ma de #041', imageUrls: [] },
  { id: 'fa2022-re-block5', title: 'JDP123 - FA 2022 - RE - Block5', code: 'Ma de #042', imageUrls: [] },
  { id: 'sp23-fe-vocabulary-1', title: 'JDP123 - SP23 - FE - VOCABULARY #1', code: 'Ma de #043', imageUrls: [] },
  { id: 'sp2023-fe', title: 'JDP123 - SP 2023 - FE', code: 'Ma de #044', imageUrls: [] },
];

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
