
import React, { useEffect, useState } from 'react';

export type RobotMood = 'idle' | 'happy' | 'thinking' | 'oops' | 'teaching';

interface RobotBuddyProps {
  mood: RobotMood;
  message?: string;
}

const RobotBuddy: React.FC<RobotBuddyProps> = ({ mood, message }) => {
  const [blink, setBlink] = useState(false);

  // Random blinking effect for a lifelike feel
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
    }, Math.random() * 4000 + 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const getMoodConfig = () => {
    switch (mood) {
      case 'happy':
        return { 
          mouthPath: 'M 35 70 Q 50 82 65 70', 
          bubble: 'Fantastic! Binary High-Five! 🖐️',
          faceColor: '#10b981', // Emerald green eyes/mouth on success
          headColor: '#ffffff'
        };
      case 'thinking':
        return { 
          mouthPath: 'M 40 72 L 60 72', 
          bubble: 'Calculating logic loops...',
          faceColor: '#60a5fa', // Soft blue when thinking
          headColor: '#f1f5f9'
        };
      case 'oops':
        return { 
          mouthPath: 'M 40 75 L 60 75', 
          bubble: 'Error detected... Keep trying!',
          faceColor: '#f43f5e', // Rose red for errors
          headColor: '#ffffff'
        };
      case 'teaching':
        return { 
          mouthPath: 'M 38 72 Q 50 78 62 72', 
          bubble: 'Look at this pattern! 💡',
          faceColor: '#818cf8', // Indigo for teaching
          headColor: '#ffffff'
        };
      default:
        return { 
          mouthPath: 'M 38 74 Q 50 78 62 74', 
          bubble: 'Ready for some code?',
          faceColor: '#94a3b8', // Slate grey for idle
          headColor: '#ffffff'
        };
    }
  };

  const config = getMoodConfig();

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-none select-none">
      {/* Speech Bubble */}
      <div className={`
        mb-4 px-4 py-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl transition-all duration-500 transform
        ${message || mood !== 'idle' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'}
      `}>
        <p className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
          {message || config.bubble}
        </p>
        <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white/95 border-r border-b border-slate-200 rotate-45"></div>
      </div>

      {/* Bit: The Tiny White Floating Head */}
      <div className={`w-16 h-16 transition-all duration-500 transform ${mood === 'happy' ? 'animate-bounce' : 'animate-float-sm'}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Glowing Antennas */}
          <g className={mood === 'thinking' ? 'animate-pulse' : ''}>
            <circle cx="50" cy="15" r="4" fill={config.faceColor} className={mood === 'thinking' ? 'animate-ping' : ''} />
            <line x1="50" y1="15" x2="50" y2="30" stroke={config.faceColor} strokeWidth="3" />
          </g>

          {/* Sleek White Head (No Body) */}
          <rect x="10" y="25" width="80" height="70" rx="28" fill={config.headColor} stroke="#e2e8f0" strokeWidth="2" />
          
          {/* Digital Screen Face */}
          <rect x="20" y="38" width="60" height="42" rx="14" fill="#1e293b" />

          {/* Expressive Eyes */}
          <g className={`transition-all duration-200 ${blink ? 'scale-y-0 translate-y-6' : 'scale-y-100'}`} style={{ transformOrigin: 'center' }}>
            {mood === 'happy' ? (
              <>
                {/* Heart Eyes */}
                <path d="M 30 48 Q 35 40 40 48 Q 45 40 50 48 L 40 58 Z" fill={config.faceColor} transform="scale(0.8) translate(5, 5)" />
                <path d="M 30 48 Q 35 40 40 48 Q 45 40 50 48 L 40 58 Z" fill={config.faceColor} transform="scale(0.8) translate(35, 5)" />
              </>
            ) : mood === 'oops' ? (
              <>
                {/* Cross/Dizzy Eyes */}
                <path d="M 32 45 L 42 55 M 42 45 L 32 55" stroke={config.faceColor} strokeWidth="4" strokeLinecap="round" />
                <path d="M 58 45 L 68 55 M 68 45 L 58 55" stroke={config.faceColor} strokeWidth="4" strokeLinecap="round" />
              </>
            ) : (
              <>
                {/* Simple Circle Eyes */}
                <circle cx="38" cy="50" r="5" fill={config.faceColor} />
                <circle cx="62" cy="50" r="5" fill={config.faceColor} />
              </>
            )}
          </g>

          {/* Digital Mouth */}
          <path 
            d={config.mouthPath} 
            fill="none" 
            stroke={config.faceColor} 
            strokeWidth="3" 
            strokeLinecap="round" 
            className="transition-all duration-300"
          />
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatSm {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-sm {
          animation: floatSm 3s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default RobotBuddy;
