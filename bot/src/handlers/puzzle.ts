import { textGeneration } from "../lib/openai.js";
import { db } from "../firebase/config.js";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { HandlerContext } from "@xmtp/message-kit";
import { getTeams, setTeam } from "../lib/db.js";
import { getStackClient } from "../lib/stack.js";

export async function generateCryptoPuzzle(): Promise<{
  riddle: string;
  answer: string;
  prize: number;
}> {
  const prompt =
    "Generate a crypto-themed riddle with its answer and a point value between 10 and 50 (based on the level of difficulty of the question), in a format so that it can be broken into riddle, answer and point by following the code: const [riddle, answer, points] = reply.split('/n').";
  const { reply } = await textGeneration(
    prompt,
    "You are a crypto puzzle generator."
  );
  const [riddle, answer, points] = reply.split("\n");
  return { riddle, answer, prize: parseInt(points) };
}

export async function generateDeFiInsight(): Promise<string> {
  const prompt =
    "Generate a brief, educational insight about a DeFi concept or protocol.";
  const { reply } = await textGeneration(prompt, "You are a DeFi educator.");
  return reply;
}

export async function postNewPuzzle(context: HandlerContext) {
  try {
    const puzzle = await generateCryptoPuzzle();
    await setDoc(doc(db, "gameState", "currentPuzzle"), puzzle);
    await context.conversation.send(
      `🧩 New Puzzle:\n${puzzle.riddle}\n\nUse /solve_puzzle [your answer] to submit your solution!`
    );
  } catch (error) {
    console.error("Error posting new puzzle:", error);
  }
}

export async function postDailyInsight(context: HandlerContext) {
  try {
    const insight = await generateDeFiInsight();
    await context.conversation.send(`📊 Daily DeFi Insight:\n${insight}`);
  } catch (error) {
    console.error("Error posting daily insight:", error);
  }
}

export function setupScheduler(context: HandlerContext) {
  setInterval(() => postNewPuzzle(context), 6 * 60 * 60 * 1000);
  setInterval(() => postDailyInsight(context), 24 * 60 * 60 * 1000);
}

export async function getCurrentPuzzle() {
  const puzzleDoc = await getDoc(doc(db, "gameState", "currentPuzzle"));
  return puzzleDoc.exists() ? puzzleDoc.data() : null;
}

export async function clearCurrentPuzzle() {
  await deleteDoc(doc(db, "gameState", "currentPuzzle"));
}

export async function getPuzzle(context: HandlerContext) {
  const currentPuzzle = await getCurrentPuzzle();
  if (!currentPuzzle) {
    await context.reply("There is no active puzzle right now.");
    return;
  }

  await context.reply(
    `🧩 Current Puzzle:\n${currentPuzzle.riddle}\n\nUse /solve_puzzle [your answer] to submit your solution!`
  );
}

export async function solvePuzzle(context: HandlerContext) {
  const {
    sender,
    content: {
      params: { answer },
    },
  } = context.message;

  const currentPuzzle = await getCurrentPuzzle();
  if (!currentPuzzle) {
    await context.reply("There is no active puzzle right now.");
    return;
  }

  if (answer.toLowerCase() !== currentPuzzle.answer.toLowerCase()) {
    await context.reply(
      "Sorry, that's not the correct answer. Keep trying Anon!"
    );
    return;
  }

  const teams = await getTeams();
  const solverTeam = Object.entries(teams).find(([, team]) =>
    team.members.some((member) => member.address === sender.address)
  );

  if (!solverTeam) {
    await context.reply("You need to be in a team to solve puzzles.");
    return;
  }

  const [teamName, teamData] = solverTeam;

  teamData.points += currentPuzzle.prize;
  await setTeam(teamName, teamData);

  const stackClient = getStackClient();
  if (stackClient) {
    try {
      await stackClient.track("puzzle_solve", {
        points: currentPuzzle.prize,
        account: sender.address,
        uniqueId: `puzzle_${currentPuzzle.riddle.substring(0, 20)}`,
        metadata: {
          teamName: teamName,
        },
      });
    } catch (error) {
      console.error("Error tracking points with Stack Client:", error);
    }
  }

  await context.conversation.send(
    `🎉 Congratulations to ${sender.username} from team "${teamName}"! They solved the puzzle and earned ${currentPuzzle.prize} points for their team.`
  );

  await clearCurrentPuzzle();
  await postNewPuzzle(context);
}
