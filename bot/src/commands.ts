import type { CommandGroup, CommandHandlers } from "@xmtp/message-kit";
import { createTeam, joinTeam, managePortfolio } from "./handlers/team";
import { postDailyInsight, solvePuzzle } from "./handlers/puzzle";
import {showLeaderboard} from "./handlers/leaderboard";

export const commandHandlers: CommandHandlers = {
  "/create_team": createTeam,
  "/join_team": joinTeam,
  "/solve_puzzle": solvePuzzle,
  "/portfolio": managePortfolio,
  "/leaderboard": showLeaderboard,
  "/daily_insight": postDailyInsight,
};

export const commands: CommandGroup[] = [
  {
    name: "DeFi Treasure League",
    icon: "🏴‍☠️",
    description: "Hunt for crypto treasures and manage your DeFi portfolio!",
    commands: [
      {
        command: "/create_team [teamName]",
        description: "Create a new team",
        params: {
          teamName: { type: "string" },
        },
      },
      {
        command: "/join_team [teamName]",
        description: "Join an existing team",
        params: {
          teamName: { type: "string" },
        },
      },
      {
        command: "/solve_puzzle [answer]",
        description: "Submit an answer to the current puzzle",
        params: {
          answer: { type: "string" },
        },
      },
      {
        command: "/portfolio [action] [protocol] [amount]",
        description: "Manage your team's DeFi portfolio",
        params: {
          action: { type: "string", values: ["invest", "withdraw"] },
          protocol: { type: "string" },
          amount: { type: "number" },
        },
      },
      {
        command: "/leaderboard",
        description: "View the current leaderboard",
        params: {},
      },
      {
        command: "/daily_insight",
        description: "Get a daily DeFi insight",
        params: {},
      },
    ],
  },
];

export const appConfig = {
  commands: commands,
  commandHandlers: commandHandlers
};
