import Link from 'next/link';
import { ChevronLeft, FileText, Download, BookOpen } from 'lucide-react';

export default function DocViewer({ params }: { params: { jobId: string; docType: string } }) {
  const { jobId, docType } = params;
  const titleMap: Record<string, string> = {
    'material-sheet': 'Material Sheet',
    'drawing': 'Construction Drawing',
    'spec': 'Specification',
  };
  const title = titleMap[docType] || 'Document';

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white">
            <ChevronLeft className="w-4 h-4" /> Back
          </Link>
          <span className="text-[11px] text-gray-500">Job #{jobId}</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium flex items-center gap-2">
              {docType === 'spec' ? <BookOpen className="w-5 h-5 text-cyan-300" /> : <FileText className="w-5 h-5 text-cyan-300" />}
              {title}
            </h1>
            <button className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/50 p-6 text-sm text-gray-300">
            <p className="text-gray-400 mb-2">Preview</p>
            <div className="h-72 rounded-md bg-white/[0.02] border border-white/10 flex items-center justify-center text-gray-500">
              {title} preview placeholder
            </div>
            <p className="text-[12px] text-gray-500 mt-3">
              This is a mock viewer. Link actual files or a document service when available.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
