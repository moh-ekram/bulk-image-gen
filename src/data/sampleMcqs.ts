import { McqItem } from '../types';
import * as XLSX from 'xlsx';

export const SAMPLE_MCQS: McqItem[] = [
  {
    id: '1',
    question: "‘UNO’ এর সদর দপ্তর কোথায় অবস্থিত?",
    optionA: "জেনেভা",
    optionB: "প্যারিস",
    optionC: "নিউ ইয়র্ক",
    optionD: "লন্ডন",
    correctAnswer: "C",
    category: "সাধারণ জ্ঞান"
  },
  {
    id: '2',
    question: "Which planet is known as the Red Planet?",
    optionA: "Earth",
    optionB: "Venus",
    optionC: "Mars",
    optionD: "Jupiter",
    correctAnswer: "C",
    category: "Science"
  },
  {
    id: '3',
    question: "বাংলাদেশের জাতীয় কবির নাম কী?",
    optionA: "রবীন্দ্রনাথ ঠাকুর",
    optionB: "কাজী নজরুল ইসলাম",
    optionC: "জসীম উদ্দীন",
    optionD: "জীবনানন্দ দাশ",
    correctAnswer: "B",
    category: "বাংলা সাহিত্য"
  },
  {
    id: '4',
    question: "What is the capital city of Japan?",
    optionA: "Kyoto",
    optionB: "Osaka",
    optionC: "Tokyo",
    optionD: "Hiroshima",
    correctAnswer: "C",
    category: "World Geography"
  },
  {
    id: '5',
    question: "কম্পিউটারের মস্তিষ্ক বা ব্রেইন বলা হয় কোনটিকে?",
    optionA: "RAM",
    optionB: "Hard Disk",
    optionC: "CPU",
    optionD: "Monitor",
    correctAnswer: "C",
    category: "কম্পিউটার ও তথ্যপ্রযুক্তি"
  },
  {
    id: '6',
    question: "Who wrote the famous play 'Romeo and Juliet'?",
    optionA: "Charles Dickens",
    optionB: "William Shakespeare",
    optionC: "Mark Twain",
    optionD: "Jane Austen",
    correctAnswer: "B",
    category: "Literature"
  },
  {
    id: '7',
    question: "পদ্মা সেতুর দৈর্ঘ্য কত কিলোমিটার?",
    optionA: "৫.১৫ কি.মি.",
    optionB: "৬.১৫ কি.মি.",
    optionC: "৭.১৫ কি.মি.",
    optionD: "৪.৮ কি.মি.",
    correctAnswer: "B",
    category: "বাংলাদেশ বিষয়াবলী"
  },
  {
    id: '8',
    question: " What is the chemical symbol for Gold?",
    optionA: "Ag",
    optionB: "Au",
    optionC: "Fe",
    optionD: "Cu",
    correctAnswer: "B",
    category: "Chemistry"
  }
];

export function downloadSampleExcel() {
  // Format 1: Standard Correct Answer Column
  const standardData = [
    {
      "Question": "‘UNO’ এর সদর দপ্তর কোথায় অবস্থিত?",
      "Option A": "জেনেভা",
      "Option B": "প্যারিস",
      "Option C": "নিউ ইয়র্ক",
      "Option D": "লন্ডন",
      "Correct Answer": "C",
      "Category": "সাধারণ জ্ঞান"
    },
    {
      "Question": "Which planet is known as the Red Planet?",
      "Option A": "Earth",
      "Option B": "Venus",
      "Option C": "Mars",
      "Option D": "Jupiter",
      "Correct Answer": "C",
      "Category": "Science"
    },
    {
      "Question": "বাংলাদেশের জাতীয় কবির নাম কী?",
      "Option A": "রবীন্দ্রনাথ ঠাকুর",
      "Option B": "কাজী নজরুল ইসলাম",
      "Option C": "জসীম উদ্দীন",
      "Option D": "জীবনানন্দ দাশ",
      "Correct Answer": "B",
      "Category": "বাংলা সাহিত্য"
    }
  ];

  // Format 2: Hashtag (#) Format where correct option contains #
  const hashtagData = [
    {
      "Question": "বাংলাদেশের রাজধানী কোনটি?",
      "Option A": "#ঢাকা",
      "Option B": "চট্টগ্রাম",
      "Option C": "সিলেট",
      "Option D": "খুলনা",
      "Category": "বাংলাদেশ বিষয়াবলী"
    },
    {
      "Question": "What is the capital city of France?",
      "Option A": "London",
      "Option B": "Berlin",
      "Option C": "Madrid",
      "Option D": "#Paris",
      "Category": "Geography"
    },
    {
      "Question": "কম্পিউটারের মস্তিষ্ক বা ব্রেইন বলা হয় কোনটিকে?",
      "Option A": "RAM",
      "Option B": "Hard Disk",
      "Option C": "#CPU",
      "Option D": "Monitor",
      "Category": "কম্পিউটার ও তথ্যপ্রযুক্তি"
    }
  ];

  const workbook = XLSX.utils.book_new();

  // Sheet 1: Standard Format
  const ws1 = XLSX.utils.json_to_sheet(standardData);
  ws1['!cols'] = [
    { wch: 45 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 20 }
  ];
  XLSX.utils.book_append_sheet(workbook, ws1, "Standard_Format");

  // Sheet 2: Hashtag (#) Format
  const ws2 = XLSX.utils.json_to_sheet(hashtagData);
  ws2['!cols'] = [
    { wch: 45 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }
  ];
  XLSX.utils.book_append_sheet(workbook, ws2, "Hashtag_Hash_Format");

  XLSX.writeFile(workbook, "Sample_MCQ_Questions.xlsx");
}
