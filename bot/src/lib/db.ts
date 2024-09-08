import { db } from "../firebase/config";
import { Team, currentPuzzle } from "../types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export async function getTeams(): Promise<{ [teamName: string]: Team }> {
  const teamsSnapshot = await getDocs(collection(db, "teams"));
  const teams: { [teamName: string]: Team } = {};
  teamsSnapshot.forEach((doc) => {
    teams[doc.id] = doc.data() as Team;
  });
  return teams;
}

export async function setTeam(teamName: string, team: Team): Promise<void> {
  await setDoc(doc(db, "teams", teamName), team);
}

export async function getTeamByName(teamName: string): Promise<Team | null> {
  const teamDoc = await getDoc(doc(db, "teams", teamName));
  if (teamDoc.exists()) {
    return teamDoc.data() as Team;
  }
  return null;
}

export async function getCurrentPuzzle(): Promise<currentPuzzle | null> {
  const puzzleDoc = await getDoc(doc(db, "gameState", "currentPuzzle"));
  return puzzleDoc.exists() ? (puzzleDoc.data() as currentPuzzle) : null;
}

export async function setCurrentPuzzle(
  puzzle: currentPuzzle
): Promise<void> {
  await setDoc(doc(db, "gameState", "currentPuzzle"), puzzle);
}

export async function clearCurrentPuzzle(): Promise<void> {
  await deleteDoc(doc(db, "gameState", "currentPuzzle"));
}
