import React, { useState } from 'react';
import { Hymn } from '../types';
import { X, ZoomIn, ZoomOut, RotateCcw, Copy, Check, Printer, BookOpen } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface HymnDetailModalProps {
  hymn: Hymn | null;
  scheduledDate?: string | null;
  onClose: () => void;
}

export const HymnDetailModal: React.FC<HymnDetailModalProps> = ({ hymn, scheduledDate, onClose }) => {
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(1); // 0: 16px, 1: 18px (default), 2: 22px, 3: 26px
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  if (!hymn) return null;

  const fontSizes = [
    'text-base leading-relaxed',
    'text-lg sm:text-xl leading-loose',
    'text-xl sm:text-2xl leading-loose',
    'text-2xl sm:text-3xl leading-loose'
  ];

  const handleZoomIn = () => {
    if (fontSizeLevel < fontSizes.length - 1) {
      setFontSizeLevel((prev) => prev + 1);
    }
  };

  const handleZoomOut = () => {
    if (fontSizeLevel > 0) {
      setFontSizeLevel((prev) => prev - 1);
    }
  };

  const handleResetZoom = () => {
    setFontSizeLevel(1);
  };

  const handleCopy = async () => {
    try {
      const text = `Hymn #${hymn.hymn_number}: ${hymn.title}\n\n${hymn.lyrics}`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      success('Hymn lyrics copied to clipboard');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hymn-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
    >
      <div 
        className="relative w-full max-w-3xl bg-[#FAF7F2] dark:bg-[#151D2C] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#1A2335]">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#C8963E]/15 text-[#C8963E] font-serif-church font-bold text-lg">
              #{hymn.hymn_number}
            </span>
            <div>
              <span className="text-xs font-semibold text-[#5B6270] dark:text-slate-400">
                {hymn.language || 'English'} {scheduledDate && `· Sung on ${scheduledDate}`}
              </span>
              <h2 id="hymn-modal-title" className="text-lg sm:text-xl font-bold font-serif-church text-[#1F2A44] dark:text-white leading-tight">
                {hymn.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Font size controls */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
              <button
                onClick={handleZoomOut}
                disabled={fontSizeLevel === 0}
                className="min-h-[36px] min-w-[36px] px-2 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-all flex items-center justify-center"
                aria-label="Decrease font size (A-)"
                title="Decrease font size"
              >
                A-
              </button>
              <button
                onClick={handleResetZoom}
                className="min-h-[36px] min-w-[36px] px-2 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center justify-center"
                aria-label="Reset font size"
                title="Reset font size"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleZoomIn}
                disabled={fontSizeLevel === fontSizes.length - 1}
                className="min-h-[36px] min-w-[36px] px-2 py-1 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-all flex items-center justify-center"
                aria-label="Increase font size (A+)"
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* Copy Lyrics */}
            <button
              onClick={handleCopy}
              className="min-h-[36px] min-w-[36px] p-2 rounded-xl text-slate-600 hover:text-[#1F2A44] hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
              aria-label="Copy lyrics"
              title="Copy lyrics"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="hidden sm:flex min-h-[36px] min-w-[36px] p-2 rounded-xl text-slate-600 hover:text-[#1F2A44] hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors items-center justify-center"
              aria-label="Print hymn lyrics"
              title="Print hymn"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-8 bg-[#FAF7F2] dark:bg-[#151D2C]">
          <div className="max-w-xl mx-auto text-center sm:text-left">
            <div className="mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-[#5B6270] dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#C8963E]" />
                <span>Tumaini Hymnal No. {hymn.hymn_number}</span>
              </span>
              <span>Language: {hymn.language || 'English'}</span>
            </div>

            {/* Hymn Lyrics with preserved line breaks and generous typography */}
            <div
              className={`font-serif-church whitespace-pre-line text-[#1F2A44] dark:text-slate-100 selection:bg-[#C8963E]/30 tracking-normal transition-all ${fontSizes[fontSizeLevel]}`}
            >
              {hymn.lyrics}
            </div>

            <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-xs text-[#5B6270] dark:text-slate-400 font-sans">
                "Speaking to one another with psalms, hymns, and songs from the Spirit. Sing and make music from your heart to the Lord." — Ephesians 5:19
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer / Close */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#1A2335]/70 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-6 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default HymnDetailModal;
