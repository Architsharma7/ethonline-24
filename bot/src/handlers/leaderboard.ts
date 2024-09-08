import { HandlerContext } from "@xmtp/message-kit";
import { getStackClient } from "../lib/stack.js";
import { TeamScore, LeaderboardEntry, Team } from "../types.js";
import { getTeams } from "../lib/db.js";

export async function showLeaderboard(context: HandlerContext) {
  const stackClient = getStackClient();
  if (!stackClient) {
    await context.reply("Unable to fetch leaderboard at this time.");
    return;
  }
  try {
    const leaderboard = await stackClient.getLeaderboard();
    const individualScores: LeaderboardEntry[] = leaderboard.leaderboard;
    const teams = await getTeams();
    const teamScores = calculateTeamScores(teams, individualScores);
    const sortedTeamScores = teamScores.sort(
      (a, b) => b.totalPoints - a.totalPoints
    );
    const formattedLeaderboard = sortedTeamScores
      .map(
        (team, index) =>
          `${index + 1}. ${team.teamName}: ${team.totalPoints} points`
      )
      .join("\n");

    await context.conversation.send(
      `📊 Current Team Leaderboard:\n\n${formattedLeaderboard}\n`
    );
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    await context.reply(
      "An error occurred while fetching the leaderboard. Please try again later."
    );
  }
}

function calculateTeamScores(
  teams: { [teamName: string]: Team },
  individualScores: LeaderboardEntry[]
): TeamScore[] {
  const teamScores: TeamScore[] = [];

  for (const [teamName, teamData] of Object.entries(teams)) {
    let totalPoints = 0;
    const memberAddresses = teamData.members.map((member) => member.address);

    for (const score of individualScores) {
      if (memberAddresses.includes(score.address)) {
        totalPoints += score.points;
      }
    }

    teamScores.push({
      teamName,
      totalPoints,
      members: memberAddresses,
    });
  }

  return teamScores;
}
