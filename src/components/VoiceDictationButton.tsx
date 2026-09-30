import React from 'react';
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
import { sound } from '../services/audio';

interface VoiceDictationButtonProps {
  isListening: boolean;
  onToggle: () => void;
  isSupported?: boolean;
  samplePrompts?: string[];
  onSelectSample?: (text: string) => void;
  label?: string;
}

export const VoiceDictationButton: React.FC<VoiceDictationButtonProps> = ({
  isListening,
  onToggle,
  isSupported = true,
  samplePrompts = [],
  onSelectSample,
  label = 'Dikte Suara'
}) => {
  const handleClick = () => {
    sound.playAlertTone();
    onToggle();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          isListening
            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md animate-pulse ring-2 ring-rose-400'
            : 'bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
        }`}
        title={isListening ? 'Hentikan dikte suara' : 'Mulai bicara untuk dikte suara (hands-free)'}
      >
        {isListening ? (
          <>
            <MicOff className="w-3.5 h-3.5 text-white" />
            <span>Mendengarkan Suara... (Klik untuk Berhenti)</span>
            <span className="flex gap-0.5 items-end h-3 ml-1">
              <span className="w-0.5 h-2 bg-white animate-bounce" />
              <span className="w-0.5 h-3 bg-white animate-bounce delay-75" />
              <span className="w-0.5 h-1.5 bg-white animate-bounce delay-150" />
            </span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{label}</span>
          </>
        )}
      </button>

      {/* Quick sample chips for instant hands-free testing without mic permissions */}
      {samplePrompts.length > 0 && onSelectSample && !isListening && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 overflow-x-auto py-1">
          <span className="flex items-center gap-1 text-slate-400 shrink-0">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Contoh Cepat:</span>
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                sound.playAlertTone();
                onSelectSample(prompt);
              }}
              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 transition-colors shrink-0 cursor-pointer text-[10px]"
            >
              "{prompt.slice(0, 32)}..."
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
