
import React from 'react';

interface CodeDisplayProps {
  code: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code }) => {
  // Enhanced syntax highlighting for a professional look
  const highlightCode = (text: string) => {
    return text
      // Comments
      .replace(/(#.*)/g, '<span class="text-slate-500 italic">$1</span>')
      // Keywords
      .replace(/\b(def|class|if|else|elif|for|while|try|except|finally|with|as|import|from|return|yield|break|continue|pass|lambda|global|nonlocal|del|in|is|and|or|not|assert|await|async)\b/g, '<span class="text-pink-500 font-medium">$1</span>')
      // Built-ins & Constants
      .replace(/\b(print|range|len|int|str|float|list|dict|set|tuple|super|True|False|None)\b/g, '<span class="text-blue-400 font-medium">$1</span>')
      // Self
      .replace(/\b(self)\b/g, '<span class="text-orange-400 italic">$1</span>')
      // Function calls (word before parenthesis)
      .replace(/(\b\w+)(?=\()/g, '<span class="text-yellow-200">$1</span>')
      // Strings
      .replace(/("[^"]*"|'[^']*')/g, '<span class="text-emerald-400">$1</span>')
      // Numbers
      .replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>')
      // Operators and punctuation
      .replace(/([\+\-\*\/\%\=\!\>\<\|\&]|\:)/g, '<span class="text-sky-400">$1</span>')
      // Placeholders
      .replace(/(____|\?)/g, '<span class="bg-indigo-500/30 px-1 rounded ring-1 ring-indigo-500/50 animate-pulse text-white">$1</span>');
  };

  const lines = code.trim().split('\n');

  return (
    <div className="w-full rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-[#0d1117]">
      {/* Editor Header / Title Bar */}
      <div className="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-slate-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <i className="fa-brands fa-python text-sky-400"></i>
          <span className="font-medium tracking-wide">main.py</span>
        </div>
        <div className="w-12"></div> {/* Spacer to center the title */}
      </div>

      {/* Editor Body */}
      <div className="flex bg-[#0d1117] overflow-x-auto">
        {/* Line Numbers Column */}
        <div className="py-4 px-3 bg-[#0d1117] text-right select-none border-r border-slate-800/50 min-w-[3rem]">
          {lines.map((_, i) => (
            <div key={i} className="text-slate-600 code-font text-sm leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Content */}
        <div className="py-4 px-6 flex-1">
          <pre className="code-font text-[15px] leading-6 whitespace-pre">
            <code 
              className="block"
              dangerouslySetInnerHTML={{ 
                __html: lines.map(line => highlightCode(line)).join('\n') 
              }} 
            />
          </pre>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-[#0d1117] px-4 py-1 border-t border-slate-800/50 flex justify-end gap-4">
        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">UTF-8</span>
        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Python 3.x</span>
      </div>
    </div>
  );
};

export default CodeDisplay;
