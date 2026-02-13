
import React, { useState, useEffect, useCallback } from 'react';
import { Challenge, Difficulty, UserState } from './types';
import { INITIAL_CHALLENGES, XP_PER_CHALLENGE, XP_PER_LEVEL } from './constants';
import { generateAIChallenge, getAIExplanation } from './services/geminiService';
import StatBadge from './components/StatBadge';
import CodeDisplay from './components/CodeDisplay';
import LessonView from './components/LessonView';
import RobotBuddy, { RobotMood } from './components/RobotBuddy';

const SESSION_LIMIT = 8;

const App: React.FC = () => {
  // --- User State ---
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem('python_quickcode_user');
    return saved ? JSON.parse(saved) : {
      xp: 0,
      level: 1,
      streak: 0,
      lastCompletedDate: null,
      completedChallenges: []
    };
  });

  // --- Session State ---
  const [sessionIndex, setSessionIndex] = useState(0); // 0 to 7
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionChallenges, setSessionChallenges] = useState<Challenge[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [showLesson, setShowLesson] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [robotMood, setRobotMood] = useState<RobotMood>('idle');
  const [bitMessage, setBitMessage] = useState<string>('');

  // Initialize first challenge from pool
  useEffect(() => {
    const initSession = async () => {
      // Start with initial challenges
      setSessionChallenges([...INITIAL_CHALLENGES]);
      setCurrentChallenge(INITIAL_CHALLENGES[0]);
      
      if (user.completedChallenges.length === 0) {
        setShowLesson(true);
        setRobotMood('teaching');
        setBitMessage("Beep Boop! I'm Bit. Ready to code?");
      }
    };
    initSession();
  }, []);

  useEffect(() => {
    localStorage.setItem('python_quickcode_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (isGameOver) {
      setRobotMood('happy');
      setBitMessage("Party time! You finished the session!");
    } else if (showLesson) {
      setRobotMood('teaching');
      setBitMessage("Analyzing logic patterns...");
    } else if (aiLoading) {
      setRobotMood('thinking');
      setBitMessage("Mining new challenges...");
    } else if (!showFeedback) {
      setRobotMood('idle');
      setBitMessage('');
    }
  }, [showLesson, aiLoading, showFeedback, isGameOver]);

  // --- Handlers ---
  const handleCheck = async () => {
    if (!selectedOption || !currentChallenge) return;

    setIsLoading(true);
    setRobotMood('thinking');
    setBitMessage("Compiling your answer...");
    
    const correct = selectedOption === currentChallenge.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      setExplanation(currentChallenge.explanation);
      setRobotMood('happy');
      setBitMessage("System Green! You got it!");
      
      setUser(prev => {
        const newXp = prev.xp + XP_PER_CHALLENGE;
        const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
        const today = new Date().toDateString();
        let newStreak = prev.streak;
        if (prev.lastCompletedDate !== today) newStreak += 1;

        return {
          ...prev,
          xp: newXp,
          level: newLevel,
          streak: newStreak,
          lastCompletedDate: today,
          completedChallenges: Array.from(new Set([...prev.completedChallenges, currentChallenge.id]))
        };
      });
    } else {
      setRobotMood('oops');
      setBitMessage("Minor glitch... Let's debug!");
      try {
        const aiExp = await getAIExplanation(currentChallenge.code, selectedOption, currentChallenge.correctAnswer);
        setExplanation(aiExp);
      } catch (err) {
        setExplanation(currentChallenge.explanation);
      }
    }

    setIsLoading(false);
    setShowFeedback(true);
  };

  const nextChallenge = useCallback(async () => {
    if (sessionIndex >= SESSION_LIMIT - 1) {
      setIsGameOver(true);
      return;
    }

    setSelectedOption(null);
    setShowFeedback(false);
    setExplanation('');
    setRobotMood('idle');
    setBitMessage("Loading next block...");
    
    const nextIdx = sessionIndex + 1;
    setSessionIndex(nextIdx);

    let next: Challenge;
    // Check if we already have it in our pool
    if (nextIdx < sessionChallenges.length) {
      next = sessionChallenges[nextIdx];
    } else {
      setAiLoading(true);
      try {
        const topics = ['Loops', 'Functions', 'Dictionaries', 'Classes', 'Logic', 'Recursion', 'Slicing'];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        // Generate a challenge. We pass a prompt to ensure uniqueness if needed, but the model usually generates fresh stuff.
        next = await generateAIChallenge(randomTopic, user.level > 3 ? Difficulty.INTERMEDIATE : Difficulty.BEGINNER);
        setSessionChallenges(prev => [...prev, next]);
      } catch (err) {
        next = INITIAL_CHALLENGES[0]; // Fallback
      } finally {
        setAiLoading(false);
      }
    }

    setCurrentChallenge(next);
    if (['Functions', 'Loops', 'Lists', 'Dictionaries', 'Classes'].includes(next.topic)) {
       setShowLesson(true);
    }
  }, [sessionIndex, sessionChallenges, user.level]);

  const restartSession = () => {
    window.location.reload(); // Simplest way to reset everything for a fresh 8-question batch
  };

  const progressPercent = ((user.xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
  
  const getFinalFeedback = (score: number) => {
    if (score === 8) {
      return { emoji: '🎉', title: 'Excellent!', message: 'A perfect score! You are a Python master.' };
    }
    if (score >= 6) {
      return { emoji: '👍', title: 'Very Good!', message: "You've got a great handle on this." };
    }
    if (score >= 4) {
      return { emoji: '🙂', title: 'Not Bad!', message: 'Keep practicing to sharpen your skills.' };
    }
    return { emoji: '💪', title: 'Review Needed!', message: "Don't worry! Re-read the lesson and try again." };
  };

  if (isGameOver) {
    const finalFeedback = getFinalFeedback(correctCount);
    const scorePercentage = Math.round((correctCount / SESSION_LIMIT) * 100);

    return (
      <div className="min-h-screen flex flex-col items-center p-4 md:p-8 max-w-4xl mx-auto justify-center text-center">
        <RobotBuddy mood="happy" message={`You scored ${correctCount} out of 8! Great job!`} />
        
        <div className="bg-slate-900/40 backdrop-blur-md rounded-[3rem] p-10 md:p-16 border border-slate-800 shadow-2xl animate-in zoom-in duration-500 max-w-lg w-full">
          <div className="relative mb-8">
             <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20"></div>
             <div className="relative text-7xl mb-4">{finalFeedback.emoji}</div>
             <h2 className="text-4xl font-black text-white mb-2">{finalFeedback.title}</h2>
             <p className="text-slate-400 font-medium">{finalFeedback.message}</p>
          </div>

          <div className="flex flex-col gap-6 mb-10">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
               <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Final Score</p>
               <p className="text-5xl font-black text-emerald-400">{correctCount} <span className="text-3xl text-slate-500">/ {SESSION_LIMIT}</span></p>
               <p className="text-slate-400 mt-2 text-sm">{scorePercentage}% correct</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-500/10 rounded-2xl p-4 border border-indigo-500/20">
                <p className="text-indigo-400 font-bold text-2xl">+{correctCount * XP_PER_CHALLENGE}</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold">XP Earned</p>
              </div>
              <div className="bg-orange-500/10 rounded-2xl p-4 border border-orange-500/20">
                <p className="text-orange-400 font-bold text-2xl">{user.streak}</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold">Day Streak</p>
              </div>
            </div>
          </div>

          <button 
            onClick={restartSession}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-indigo-600/30 active:scale-95"
          >
            START NEW SESSION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 max-w-4xl mx-auto">
      <RobotBuddy mood={robotMood} message={bitMessage} />
      
      {/* Header */}
      <header className="w-full mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-500 text-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg transform -rotate-6 transition-all hover:rotate-0 hover:scale-110 cursor-default">
            P
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">CodeQuiz Python</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-700 ease-out" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Level {user.level}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto">
          <StatBadge icon="fa-solid fa-list-check" value={`${sessionIndex + 1}/${SESSION_LIMIT}`} label="Progress" colorClass="bg-emerald-500" />
          <StatBadge icon="fa-solid fa-fire" value={user.streak} label="Streak" colorClass="bg-orange-500" />
        </div>
      </header>

      {/* Content Switcher */}
      <div className="w-full">
        {showLesson ? (
          <LessonView 
            topic={currentChallenge?.topic || 'Coding'} 
            onStart={() => setShowLesson(false)} 
          />
        ) : (
          <main className="w-full bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] p-6 md:p-10 border border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-500">
            {aiLoading && (
              <div className="absolute inset-0 bg-slate-900/90 z-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center">
                  <p className="text-indigo-300 font-bold text-lg animate-pulse">Summoning a new challenge...</p>
                  <p className="text-slate-500 text-sm mt-1 italic">Thinking in Python 3.x</p>
                </div>
              </div>
            )}

            {!currentChallenge ? (
              <div className="py-20 text-center text-slate-400">Loading your training environment...</div>
            ) : (
              <>
                <div className="mb-6 flex justify-between items-start">
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                      {currentChallenge.topic} • {currentChallenge.difficulty}
                    </span>
                    <h2 className="text-xl md:text-3xl font-bold text-white mt-4 leading-tight">
                      {currentChallenge.description}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setShowLesson(true)}
                    className="group p-3 bg-slate-800/50 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all active:scale-90"
                    title="Quick Tuto"
                  >
                    <i className="fa-solid fa-lightbulb text-xl group-hover:rotate-12"></i>
                  </button>
                </div>

                <div className="mb-8 transform transition-all duration-500 hover:scale-[1.01]">
                  <CodeDisplay code={currentChallenge.code} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentChallenge.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => !showFeedback && setSelectedOption(option)}
                      disabled={showFeedback}
                      className={`
                        p-6 rounded-2xl border-2 text-left transition-all duration-200 group flex items-center gap-5
                        ${selectedOption === option 
                          ? 'border-indigo-500 bg-indigo-500/10 shadow-lg' 
                          : 'border-slate-800 bg-slate-800/40 hover:border-slate-600 hover:bg-slate-800/60'}
                        ${showFeedback && option === currentChallenge.correctAnswer ? 'border-emerald-500 bg-emerald-500/20 scale-[1.02] z-10' : ''}
                        ${showFeedback && selectedOption === option && option !== currentChallenge.correctAnswer ? 'border-rose-500 bg-rose-500/20' : ''}
                      `}
                    >
                      <div className={`
                        w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg flex-shrink-0 transition-transform group-hover:scale-110
                        ${selectedOption === option ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}
                        ${showFeedback && option === currentChallenge.correctAnswer ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50' : ''}
                        ${showFeedback && selectedOption === option && option !== currentChallenge.correctAnswer ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50' : ''}
                      `}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className={`text-lg font-bold ${selectedOption === option ? 'text-white' : 'text-slate-300'}`}>
                        {option}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-12 flex flex-col items-center">
                  {!showFeedback ? (
                    <button
                      onClick={handleCheck}
                      disabled={!selectedOption || isLoading}
                      className={`
                        w-full md:w-72 py-5 rounded-2xl font-black text-xl transition-all transform active:scale-95 shadow-2xl
                        ${!selectedOption || isLoading
                          ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20 hover:shadow-indigo-600/40'}
                      `}
                    >
                      {isLoading ? 'ANALYZING...' : 'CHECK ANSWER'}
                    </button>
                  ) : (
                    <div className="w-full flex flex-col items-center space-y-8">
                      <div className={`
                        w-full p-8 rounded-[2rem] border-2 flex items-start gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700
                        ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}
                      `}>
                        <div className={`
                          w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl shadow-xl
                          ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}
                        `}>
                          <i className={`fa-solid ${isCorrect ? 'fa-check' : 'fa-xmark'}`}></i>
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-black text-2xl uppercase tracking-tight ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isCorrect ? 'Logic Match!' : 'Syntax Error...'}
                          </h3>
                          <p className="text-slate-300 mt-2 text-lg leading-relaxed font-medium">
                            {explanation}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={nextChallenge}
                        className="group w-full md:w-72 py-5 bg-white text-slate-900 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all shadow-[0_15px_30px_rgba(255,255,255,0.15)] active:scale-95 flex items-center justify-center gap-3"
                      >
                        {sessionIndex >= SESSION_LIMIT - 1 ? 'FINISH QUIZ' : 'NEXT QUESTION'}
                        <i className="fa-solid fa-chevron-right text-sm group-hover:translate-x-1 transition-transform"></i>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        )}
      </div>

      <footer className="mt-16 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
        <p>CodeQuiz Python • 2025</p>
      </footer>
    </div>
  );
};

export default App;
