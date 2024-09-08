import { textGeneration } from "../lib/openai";
import { gameConversation } from "../types";
import { db } from "../firebase/config";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

export async function generateCryptoPuzzle(): Promise<{
  riddle: string;
  answer: string;
  prize: number;
}> {
  const prompt =
    "Generate a crypto-themed riddle with its answer and a point value between 10 and 50, in a format so that it can be broken into riddle, answer and point by following the code: const [riddle, answer, points] = reply.split('/n')";
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

export async function postNewPuzzle() {
  try {
    const puzzle = await generateCryptoPuzzle();
    await setDoc(doc(db, "gameState", "currentPuzzle"), puzzle);
    await gameConversation?.send(
      `🧩 New Puzzle:\n${puzzle.riddle}\n\nUse /solve_puzzle [your answer] to submit your solution!`
    );
  } catch (error) {
    console.error("Error posting new puzzle:", error);
  }
}

export async function postDailyInsight() {
  try {
    const insight = await generateDeFiInsight();
    await gameConversation?.send(`📊 Daily DeFi Insight:\n${insight}`);
  } catch (error) {
    console.error("Error posting daily insight:", error);
  }
}

export function setupScheduler() {
  setInterval(postNewPuzzle, 6 * 60 * 60 * 1000);
  setInterval(postDailyInsight, 24 * 60 * 60 * 1000);
  postNewPuzzle();
  postDailyInsight();
}

export async function getCurrentPuzzle() {
  const puzzleDoc = await getDoc(doc(db, "gameState", "currentPuzzle"));
  return puzzleDoc.exists() ? puzzleDoc.data() : null;
}

export async function clearCurrentPuzzle() {
  await deleteDoc(doc(db, "gameState", "currentPuzzle"));
}
