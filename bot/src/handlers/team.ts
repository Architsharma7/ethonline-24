import { HandlerContext } from "@xmtp/message-kit";
import { teams, MAX_TEAM_SIZE, MIN_TEAM_SIZE, Team } from "../types";
import { getTeamByName, setTeam, getTeams } from "../lib/db";

export async function createTeam(context: HandlerContext) {
  const {
    sender,
    content: {
      params: { teamName },
    },
  } = context.message;
  if (teams[teamName]) {
    await context.reply(
      "Team name already exists. Please choose another name."
    );
    return;
  }

  const allTeams = await getTeams();
  const userExistingTeam = Object.values(allTeams).find((team) =>
    team.members.some((member) => member.address === sender.address)
  );

  if (userExistingTeam) {
    await context.reply(
      "You are already in a team. Leave your current team before creating a new one."
    );
    return;
  }

  const newTeam: Team = {
    members: [sender],
    portfolio: {},
    points: 0,
  };

  await setTeam(teamName, newTeam);

  await context.conversation.send(
    `Team "${teamName}" has been created and joined the game!`
  );
  await context.reply(
    `Team "${teamName}" created successfully! You've been added to the main game chat. Invite ${
      MIN_TEAM_SIZE - 1
    } to ${MAX_TEAM_SIZE - 1} more members to complete your team.`
  );
}

export async function joinTeam(context: HandlerContext) {
  const {
    sender,
    content: {
      params: { teamName },
    },
  } = context.message;

  const team = await getTeamByName(teamName);

  if (!team) {
    await context.reply("Team does not exist. Please check the team name.");
    return;
  }

  if (team.members.some((member) => member.address === sender.address)) {
    await context.reply("You are already in this team.");
    return;
  }

  const allTeams = await getTeams();
  const userExistingTeam = Object.values(allTeams).find((t) =>
    t.members.some((member) => member.address === sender.address)
  );
  if (userExistingTeam) {
    await context.reply(
      "You are already in a team. Leave your current team before joining a new one."
    );
    return;
  }

  if (team.members.length >= MAX_TEAM_SIZE) {
    await context.reply(
      `Team "${teamName}" is already full (${MAX_TEAM_SIZE} members). Please join or create another team.`
    );
    return;
  }

  team.members.push(sender);
  await setTeam(teamName, team);

  await context.conversation.send(
    `${sender.username} has joined team "${teamName}"!`
  );

  if (
    team.members.length >= MIN_TEAM_SIZE &&
    team.members.length < MAX_TEAM_SIZE
  ) {
    await context.reply(
      `You have joined team "${teamName}"! Your team now has ${
        team.members.length
      } members and can start playing. You can still add up to ${
        MAX_TEAM_SIZE - team.members.length
      } more members.`
    );
  } else if (team.members.length === MAX_TEAM_SIZE) {
    await context.reply(
      `You have joined team "${teamName}"! Your team is now full with ${MAX_TEAM_SIZE} members.`
    );
  } else {
    await context.reply(
      `You have joined team "${teamName}"! You need ${
        MIN_TEAM_SIZE - team.members.length
      } more members to start playing.`
    );
  }
}

export async function listTeams(context: HandlerContext) {
  try {
    const teams = await getTeams();

    if (Object.keys(teams).length === 0) {
      await context.reply(
        "There are no teams registered yet. Be the first to create a team!"
      );
      return;
    }

    let teamList = "📋 Registered Teams:\n\n";

    for (const [teamName, team] of Object.entries(teams)) {
      const memberCount = team.members.length;
      const availableSlots = MAX_TEAM_SIZE - memberCount;

      teamList += `🏴‍☠️ ${teamName}\n`;
      teamList += `   Members (${memberCount}/${MAX_TEAM_SIZE}): ${team.members
        .map((m) => m.username)
        .join(", ")}\n`;

      if (availableSlots > 0) {
        teamList += `   Slots available: ${availableSlots}\n`;
      } else {
        teamList += `   Team is full\n`;
      }

      teamList += `   Points: ${team.points}\n\n`;
    }

    teamList += "To join a team, use the command: /join_team [team_name]";

    await context.reply(teamList);
  } catch (error) {
    console.error("Error fetching team list:", error);
    await context.reply(
      "An error occurred while fetching the team list. Please try again later."
    );
  }
}
