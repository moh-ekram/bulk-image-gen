import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, Download, Check, AlertCircle, ArrowRight, Info, Table, FileCheck } from 'lucide-react';
import { McqItem, ExcelColumnMapping } from '../types';
import { downloadSampleExcel } from '../data/sampleMcqs';

interface Props {
  onMcqsLoaded: (mcqs: McqItem[], fileName: string) => void;
}

export const ExcelUploader: React.FC<Props> = ({ onMcqsLoaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, any>[]>([]);
  const [workbookObj, setWorkbookObj] = useState<XLSX.WorkBook | null>(null);

  const [mapping, setMapping] = useState<ExcelColumnMapping>({
    questionCol: '',
    optionACol: '',
    optionBCol: '',
    optionCCol: '',
    optionDCol: '',
    correctCol: '',
    categoryCol: '',
  });

  const [step, setStep] = useState<'upload' | 'map'>('upload');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-detect columns based on header strings
  const autoDetectColumns = (headerList: string[]) => {
    const newMapping: ExcelColumnMapping = {
      questionCol: '',
      optionACol: '',
      optionBCol: '',
      optionCCol: '',
      optionDCol: '',
      correctCol: '',
      categoryCol: '',
    };

    headerList.forEach((h) => {
      const lower = h.toLowerCase().trim();
      if (
        (lower.includes('question') || lower.includes('প্রশ্ন') || lower === 'q') &&
        !newMapping.questionCol
      ) {
        newMapping.questionCol = h;
      } else if (
        (lower.includes('option a') || lower.includes('option_a') || lower === 'a' || lower.includes('অপশন ক')) &&
        !newMapping.optionACol
      ) {
        newMapping.optionACol = h;
      } else if (
        (lower.includes('option b') || lower.includes('option_b') || lower === 'b' || lower.includes('অপশন খ')) &&
        !newMapping.optionBCol
      ) {
        newMapping.optionBCol = h;
      } else if (
        (lower.includes('option c') || lower.includes('option_c') || lower === 'c' || lower.includes('অপশন গ')) &&
        !newMapping.optionCCol
      ) {
        newMapping.optionCCol = h;
      } else if (
        (lower.includes('option d') || lower.includes('option_d') || lower === 'd' || lower.includes('অপশন ঘ')) &&
        !newMapping.optionDCol
      ) {
        newMapping.optionDCol = h;
      } else if (
        (lower.includes('answer') || lower.includes('correct') || lower.includes('উত্তর')) &&
        !newMapping.correctCol
      ) {
        newMapping.correctCol = h;
      } else if (
        (lower.includes('category') || lower.includes('subject') || lower.includes('ক্যাটাগরি')) &&
        !newMapping.categoryCol
      ) {
        newMapping.categoryCol = h;
      }
    });

    // Fallback if not auto-detected: pick sequential columns
    if (!newMapping.questionCol && headerList[0]) newMapping.questionCol = headerList[0];
    if (!newMapping.optionACol && headerList[1]) newMapping.optionACol = headerList[1];
    if (!newMapping.optionBCol && headerList[2]) newMapping.optionBCol = headerList[2];
    if (!newMapping.optionCCol && headerList[3]) newMapping.optionCCol = headerList[3];
    if (!newMapping.optionDCol && headerList[4]) newMapping.optionDCol = headerList[4];

    setMapping(newMapping);
  };

  const processWorkbookSheet = (wb: XLSX.WorkBook, sheetName: string) => {
    const sheet = wb.Sheets[sheetName];
    if (!sheet) return;

    const jsonData: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    if (jsonData.length === 0) {
      setErrorMsg('মনোনীত শিটটি খালি বা কোনো তথ্য পাওয়া যায়নি!');
      return;
    }

    const firstRow = jsonData[0];
    const cols = Object.keys(firstRow);
    setHeaders(cols);
    setRawRows(jsonData);
    autoDetectColumns(cols);
    setStep('map');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        setWorkbookObj(wb);
        setSheetNames(wb.SheetNames);
        const firstSheet = wb.SheetNames[0];
        setSelectedSheet(firstSheet);

        processWorkbookSheet(wb, firstSheet);
      } catch (err) {
        console.error(err);
        setErrorMsg('ফাইলের ফরম্যাট সঠিক নয়। .xlsx, .xls অথবা .csv ফাইল আপলোড করুন।');
      }
    };

    reader.readAsBinaryString(selectedFile);
  };

  const handleSheetChange = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (workbookObj) {
      processWorkbookSheet(workbookObj, sheetName);
    }
  };

  const handleConfirmMapping = () => {
    if (!mapping.questionCol) {
      setErrorMsg('অনুগ্রহ করে প্রশ্ন (Question) কলামটি সিলেক্ট করুন!');
      return;
    }

    const mcqList: McqItem[] = rawRows
      .map((row, idx) => {
        const questionText = String(row[mapping.questionCol] || '').trim();
        if (!questionText) return null;

        let rawA = String(row[mapping.optionACol] || '').trim();
        let rawB = String(row[mapping.optionBCol] || '').trim();
        let rawC = String(row[mapping.optionCCol] || '').trim();
        let rawD = String(row[mapping.optionDCol] || '').trim();

        let detectedCorrect: string | undefined = undefined;

        // Priority 1: Check if any option contains '#' hashtag marker
        if (rawA.includes('#')) {
          detectedCorrect = 'A';
        } else if (rawB.includes('#')) {
          detectedCorrect = 'B';
        } else if (rawC.includes('#')) {
          detectedCorrect = 'C';
        } else if (rawD.includes('#')) {
          detectedCorrect = 'D';
        } else if (mapping.correctCol && row[mapping.correctCol]) {
          // Priority 2: Standard Correct Answer column
          detectedCorrect = String(row[mapping.correctCol]).trim();
        }

        // Clean '#' from options so generated images look clean
        const cleanOption = (text: string) => text.replace(/#/g, '').trim();

        const optA = cleanOption(rawA);
        const optB = cleanOption(rawB);
        const optC = cleanOption(rawC);
        const optD = cleanOption(rawD);

        if (detectedCorrect && detectedCorrect.includes('#')) {
          detectedCorrect = cleanOption(detectedCorrect);
        }

        return {
          id: `mcq-${Date.now()}-${idx + 1}`,
          question: questionText,
          optionA: optA,
          optionB: optB,
          optionC: optC,
          optionD: optD,
          correctAnswer: detectedCorrect,
          category: mapping.categoryCol ? String(row[mapping.categoryCol] || '').trim() : undefined,
        };
      })
      .filter((item): item is McqItem => item !== null);

    if (mcqList.length === 0) {
      setErrorMsg('কোনো বৈধ এমসিকিউ ডাটা পাওয়া যায়নি। ফাইল কলাম চেক করুন!');
      return;
    }

    onMcqsLoaded(mcqList, file?.name || 'excel_import');
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg p-6 shadow-xs text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded text-indigo-600">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              বাল্ক এমসিকিউ এক্সেল আপলোড
              <span className="text-[11px] bg-indigo-100 text-indigo-700 font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
                Bulk XLSX / CSV
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              এক্সেল ফাইল আপলোড করে এক ক্লিকে শত শত MCQ ছবি জেনারেট করুন
            </p>
          </div>
        </div>

        <button
          onClick={downloadSampleExcel}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700 transition-all cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          স্যাম্পল এক্সেল ফাইল (Sample XLSX)
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {step === 'upload' ? (
        <div className="space-y-6">
          <div className="border-2 border-dashed border-slate-300 hover:border-indigo-600 rounded-lg p-8 text-center bg-slate-50/50 hover:bg-indigo-50/20 transition-all cursor-pointer relative group">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="font-bold text-base text-slate-800">
                  এখানে ফাইল ছেড়ে দিন অথবা <span className="text-indigo-600 underline">ব্রাউজ করুন</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  সমর্থিত ফাইল: .XLSX, .XLS, .CSV
                </p>
              </div>
            </div>
          </div>

          {/* Excel Upload Guideline Card */}
          <div className="border border-slate-200 rounded-lg bg-slate-50/80 p-5 space-y-4">
            <div className="flex items-center justify-between text-indigo-900 font-bold text-sm border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>এক্সেল ফাইল আপলোড নির্দেশিকা ও ২ টি সমর্থিত ফরমেট</span>
              </div>
              <span className="text-[11px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                ২ টি সহজ ফরমেট
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="bg-white p-4 rounded border border-slate-200 space-y-2.5">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-indigo-600" />
                  <span>ফরমেট ১: পৃথক Correct Answer কলাম</span>
                </div>
                <p className="leading-relaxed">
                  আলাদা <strong className="text-slate-800">"Correct Answer"</strong> কলামে সঠিক উত্তরটি টাইপ করে রাখুন (যেমন: A, B, C, D অথবা উত্তরের টেক্সট):
                </p>
                <ul className="space-y-1 text-slate-700 font-mono text-[11px] bg-slate-50 p-2.5 rounded border border-slate-100">
                  <li>• <strong className="text-slate-900">Question:</strong> প্রশ্ন লিখুন</li>
                  <li>• <strong className="text-slate-900">Option A - D:</strong> ৪টি অপশন</li>
                  <li>• <strong className="text-slate-900">Correct Answer:</strong> A / B / C / D বা উত্তর</li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded border border-slate-200 space-y-2.5">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-indigo-600" />
                  <span>ফরমেট ২: হ্যাশট্যাগ (#) দিয়ে চিহ্নিত অপশন (NEW)</span>
                </div>
                <p className="leading-relaxed">
                  আলাদা উত্তর কলাম না রেখে যেকোনো অপশনের সাথে <strong className="text-indigo-600 font-bold">#</strong> চিহ্ন দিন (যেমন: <span className="bg-amber-100 text-amber-900 font-mono px-1 rounded">#ঢাকা</span>)।
                </p>
                <ul className="space-y-1 text-slate-700 text-[11px] bg-indigo-50/60 p-2.5 rounded border border-indigo-100">
                  <li>• অপশনের সাথে <code className="text-indigo-700 font-bold">#</code> থাকলে সেটি সঠিক উত্তর হিসেবে অটো-ডিটেক্ট হবে।</li>
                  <li>• ছবি তৈরির সময় অপশন থেকে <code className="text-indigo-700 font-bold">#</code> চিহ্নটি স্বয়ংক্রিয়ভাবে মুছে যাবে।</li>
                  <li>• অতিরিক্ত কোনো 'Correct Answer' কলাম রাখার প্রয়োজন নেই।</li>
                </ul>
              </div>
            </div>

            {/* Visual Example Tables Comparison */}
            <div className="space-y-3 pt-1">
              {/* Example 1 */}
              <div className="bg-white p-3.5 rounded border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-800 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-indigo-600" />
                    <span>উদাহরণ ১: পৃথক Correct Answer কলাম বিশিষ্ট এক্সেল</span>
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-1.5 py-0.5 rounded">
                    Format 1
                  </span>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded">
                  <table className="w-full text-[11px] text-left text-slate-700 whitespace-nowrap">
                    <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2 border-r border-slate-200">Question</th>
                        <th className="p-2 border-r border-slate-200">Option A</th>
                        <th className="p-2 border-r border-slate-200">Option B</th>
                        <th className="p-2 border-r border-slate-200">Option C</th>
                        <th className="p-2 border-r border-slate-200">Option D</th>
                        <th className="p-2">Correct Answer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="p-2 font-medium border-r border-slate-200">বাংলাদেশের রাজধানী কোনটি?</td>
                        <td className="p-2 border-r border-slate-200">ঢাকা</td>
                        <td className="p-2 border-r border-slate-200">চট্টগ্রাম</td>
                        <td className="p-2 border-r border-slate-200">সিলেট</td>
                        <td className="p-2 border-r border-slate-200">খুলনা</td>
                        <td className="p-2 font-medium text-emerald-700">A</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Example 2 (# Hashtag Format) */}
              <div className="bg-white p-3.5 rounded border border-indigo-200 bg-indigo-50/20 space-y-2">
                <div className="font-semibold text-indigo-900 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>উদাহরণ ২: অপশনে # চিহ্ন দিয়ে সঠিক উত্তর চিহ্নিত এক্সেল</span>
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold font-mono px-1.5 py-0.5 rounded">
                    # Hashtag Format
                  </span>
                </div>
                <div className="overflow-x-auto border border-indigo-100 rounded">
                  <table className="w-full text-[11px] text-left text-slate-700 whitespace-nowrap">
                    <thead className="bg-indigo-100/70 text-indigo-950 font-bold border-b border-indigo-200">
                      <tr>
                        <th className="p-2 border-r border-indigo-200">Question</th>
                        <th className="p-2 border-r border-indigo-200">Option A</th>
                        <th className="p-2 border-r border-indigo-200">Option B</th>
                        <th className="p-2 border-r border-indigo-200">Option C</th>
                        <th className="p-2">Option D</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-indigo-100/50 bg-white">
                      <tr>
                        <td className="p-2 font-medium border-r border-slate-200">বাংলাদেশের রাজধানী কোনটি?</td>
                        <td className="p-2 border-r border-slate-200 font-bold text-indigo-700 bg-indigo-50/80">#ঢাকা</td>
                        <td className="p-2 border-r border-slate-200">চট্টগ্রাম</td>
                        <td className="p-2 border-r border-slate-200">সিলেট</td>
                        <td className="p-2">খুলনা</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium border-r border-slate-200">What is the capital of France?</td>
                        <td className="p-2 border-r border-slate-200">London</td>
                        <td className="p-2 border-r border-slate-200">Berlin</td>
                        <td className="p-2 border-r border-slate-200">Madrid</td>
                        <td className="p-2 font-bold text-indigo-700 bg-indigo-50/80">#Paris</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Sheet Selector if multiple */}
          {sheetNames.length > 1 && (
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded border border-slate-200">
              <label className="text-xs font-bold text-slate-700">ওয়ার্কশিট বেছে নিন:</label>
              <select
                value={selectedSheet}
                onChange={(e) => handleSheetChange(e.target.value)}
                className="bg-white border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                {sheetNames.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <h3 className="text-sm font-bold text-indigo-800 mb-3 flex items-center gap-2">
              কলাম ম্যাপিং সমন্বয় করুন (Column Mapping)
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              আপনার এক্সেল ফাইলের কলামগুলো নিচে সংজ্ঞায়িত করুন:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  প্রশ্ন (Question) <span className="text-red-500">*</span>
                </label>
                <select
                  value={mapping.questionCol}
                  onChange={(e) => setMapping({ ...mapping, questionCol: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-xs text-slate-900 focus:border-indigo-600"
                >
                  <option value="">-- কলাম বেছে নিন --</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">অপশন A (Option A)</label>
                <select
                  value={mapping.optionACol}
                  onChange={(e) => setMapping({ ...mapping, optionACol: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-xs text-slate-900 focus:border-indigo-600"
                >
                  <option value="">-- কলাম বেছে নিন --</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">অপশন B (Option B)</label>
                <select
                  value={mapping.optionBCol}
                  onChange={(e) => setMapping({ ...mapping, optionBCol: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-xs text-slate-900 focus:border-indigo-600"
                >
                  <option value="">-- কলাম বেছে নিন --</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">অপশন C (Option C)</label>
                <select
                  value={mapping.optionCCol}
                  onChange={(e) => setMapping({ ...mapping, optionCCol: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-xs text-slate-900 focus:border-indigo-600"
                >
                  <option value="">-- অপশনাল --</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">অপশন D (Option D)</label>
                <select
                  value={mapping.optionDCol}
                  onChange={(e) => setMapping({ ...mapping, optionDCol: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-xs text-slate-900 focus:border-indigo-600"
                >
                  <option value="">-- অপশনাল --</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">সঠিক উত্তর (Correct Answer)</label>
                <select
                  value={mapping.correctCol}
                  onChange={(e) => setMapping({ ...mapping, correctCol: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-xs text-slate-900 focus:border-indigo-600"
                >
                  <option value="">-- অপশনাল --</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setStep('upload');
                setFile(null);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              ← অন্য ফাইল নির্বাচন করুন
            </button>

            <button
              onClick={handleConfirmMapping}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded shadow-xs transition-all cursor-pointer"
            >
              <span>{rawRows.length} টি MCQ ডাটা ইমপোর্ট করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
