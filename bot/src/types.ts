type User = {
  inboxId: string;
  username: string;
  address: string;
  accountAddresses: string[];
};

export interface Team {
  members: User[];
  portfolio: {
    [protocol: string]: {
      amount: number;
      lastUpdateTimestamp: number;
    };
  };
  points: number;
}

export interface LeaderboardEntry {
  address: string;
  points: number;
}

export interface TeamScore {
  teamName: string;
  totalPoints: number;
  members: string[];
}

export let teams: { [teamName: string]: Team } = {};
export interface currentPuzzle {
  riddle: string;
  answer: string;
  prize: number;
}
export const MAX_TEAM_SIZE = 5;
export const MIN_TEAM_SIZE = 2;
