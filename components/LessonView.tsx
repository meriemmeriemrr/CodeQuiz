
import React, { useEffect, useState } from 'react';
import CodeDisplay from './CodeDisplay';

interface LessonViewProps {
  topic: string;
  onStart: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ topic, onStart }) => {
  const [readingTime, setReadingTime] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setReadingTime((prev) => Math.max(0, prev - 1));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const getLessonContent = (topic: string) => {
    switch (topic) {
      case 'Functions':
        return {
          title: "🚀 Function Magic",
          description: "Think of a function as a mini-machine: you give it an ingredient, it does the work, and serves the result!",
          points: [
            "Start with 'def' (short for define).",
            "Give it a cool name (e.g., make_pizza).",
            "Parentheses () are hands to hold data.",
            "Use 'return' to send the result back out."
          ],
          example: "def super_power(name):\n    return name + ' turns invisible!'\n\n# Call it: super_power('Python')"
        };
      case 'Variables':
        return {
          title: "📦 Variable Boxes",
          description: "A variable is just a sticky note on a box to remember what's inside.",
          points: [
            "Name on the left, value on the right.",
            "Use '=' to store the value.",
            "No spaces in names (use_underscores).",
            "Python guesses the type automatically!"
          ],
          example: "player_score = 100\nmessage = 'Level Up!'"
        };
      default:
        return {
          title: `🎯 Target: ${topic}`,
          description: `Get ready to master this core concept. It's simpler than you think!`,
          points: [
            "Watch the punctuation closely (:).",
            "Indentation is the key to success.",
            "Every line of code has a purpose."
          ],
          example: "# Analyze this pattern carefully..."
        };
    }
  };

  const content = getLessonContent(topic);

  return (
    <div className="w-full relative">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>

      <div className="w-full bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-500 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" 
            style={{ width: `${readingTime}%` }}
          ></div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl shadow-2xl animate-float glow-effect">
              <i className="fa-solid fa-microchip text-white"></i>
            </div>
            <div className="mt-4 text-center">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">Quick Tuto</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
              {content.title}
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed font-medium">
              {content.description}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                {content.points.map((point, i) => (
                  <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors stagger-${i+1}`}>
                    <div className="mt-1 w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-bolt text-[10px] text-emerald-400"></i>
                    </div>
                    <p className="text-slate-200 text-sm md:text-base font-semibold leading-snug">{point}</p>
                  </div>
                ))}
              </div>

              <div className="stagger-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative">
                    <CodeDisplay code={content.example} />
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">
                    LIVE EXAMPLE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center stagger-4">
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-white transition-all duration-200 bg-indigo-600 font-pj rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-500/30"
          >
            <span className="flex items-center gap-3 text-lg">
              Got it, let's go!
              <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </span>
          </button>
          <p className="mt-4 text-slate-500 text-xs font-medium animate-pulse uppercase tracking-widest">
            Estimated reading: 15 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default LessonView;
