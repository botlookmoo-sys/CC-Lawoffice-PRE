
import React from 'react';
import { glossaryTerms } from '../data/glossaryData';
import { BookOpen } from 'lucide-react';

interface Props {
  word: string; // The key to look up (can be partial)
  text?: string; // The text to display if different from the term found
  children?: React.ReactNode;
}

const GlossaryTooltip: React.FC<Props> = ({ word, text, children }) => {
  // Find term that starts with or contains the word (case insensitive)
  const term = glossaryTerms.find(t => 
    t.word.toLowerCase().includes(word.toLowerCase()) || 
    word.toLowerCase().includes(t.word.split(' ')[0].toLowerCase())
  );

  const displayContent = children || text || word;

  if (!term) return <>{displayContent}</>;

  return (
    <span className="group relative inline-flex items-center cursor-help text-slate-800 hover:text-primary transition-colors">
      <span className="border-b border-dashed border-primary/40 group-hover:border-primary">
        {displayContent}
      </span>
      
      {/* Tooltip */}
      <span className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-800 text-white text-sm p-4 rounded-xl shadow-xl z-50 pointer-events-none transform group-hover:translate-y-0 translate-y-2">
         <span className="flex items-center gap-2 font-bold text-accent mb-2 pb-2 border-b border-slate-700">
            <BookOpen className="w-4 h-4" />
            {term.word}
         </span>
         <span className="block leading-relaxed text-slate-300 font-light text-xs">
            {term.definition}
         </span>
         
         {/* Triangle Arrow */}
         <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></span>
      </span>
    </span>
  );
};

export default GlossaryTooltip;
