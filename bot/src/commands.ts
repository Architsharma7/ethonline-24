import type { CommandGroup, CommandHandlers } from "@xmtp/message-kit";
import { createTeam, joinTeam, listTeams } from "./handlers/team.js";
import { postDailyInsight, solvePuzzle, getPuzzle } from "./handlers/puzzle.js";
import { showLeaderboard } from "./handlers/leaderboard.js";

export const commandHandlers: CommandHandlers = {
  "/create_team": createTeam,
  "/join_team": joinTeam,
  "/solve_puzzle": solvePuzzle,
  // "/portfolio": managePortfolio,
  "/list_teams": listTeams,
  "/leaderboard": showLeaderboard,
  "/daily_insight": postDailyInsight,
  "/get_puzzle": getPuzzle,
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
        command: "/list_teams",
        description: "List the teams in the game",
        params: {},
      },
      {
        command: "/solve_puzzle [answer]",
        description: "Submit an answer to the current puzzle",
        params: {
          answer: { type: "string" },
        },
      },
      // {
      //   command: "/portfolio [action] [protocol] [amount]",
      //   description: "Manage your team's DeFi portfolio",
      //   params: {
      //     action: { type: "string", values: ["invest", "withdraw"] },
      //     protocol: { type: "string" },
      //     amount: { type: "number" },
      //   },
      // },
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
  commandHandlers: commandHandlers,
};
