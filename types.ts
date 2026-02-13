
export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface Challenge {
  id: string;
  topic: string;
  difficulty: Difficulty;
  description: string;
  code: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface UserState {
  xp: number;
  level: number;
  streak: number;
  lastCompletedDate: string | null;
  completedChallenges: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
