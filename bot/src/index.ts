import { run, HandlerContext } from "@xmtp/message-kit";
import { appConfig, commandHandlers } from "./commands.js";
import { initializeStackClient } from "./lib/stack.js";
import {
  setupScheduler,
  postDailyInsight,
  postNewPuzzle,
} from "./handlers/puzzle.js";
import { getCurrentPuzzle } from "./lib/db.js";

let isInitialized = false;

run(async (context: HandlerContext) => {
  if (!isInitialized) {
    await initializeGame(context);
    isInitialized = true;
  }

  await checkAndPostPuzzle(context);

  const { message } = context;
  const { content, typeId } = message;

  if (typeId === "text") {
    const textContent = content.content;

    if (typeof textContent === "string") {
      if (textContent.startsWith("/")) {
        const [command] = textContent.split(" ");
        const handler = commandHandlers[command];
        if (handler) {
          await handler(context);
        } else {
          await context.reply(
            "Unknown command. Type 'gm' for a list of commands."
          );
        }
      } else {
        await handleRegularMessage(context, textContent);
      }
    }
  } else {
    console.log(`Received message of type: ${typeId}`);
  }
}, appConfig);

async function initializeGame(context: HandlerContext) {
  initializeStackClient();
  await postNewPuzzle(context);
  await postDailyInsight(context);
  setupScheduler(context);
}

async function handleRegularMessage(context: HandlerContext, content: string) {
  const lowerContent = content.toLowerCase();

  if (lowerContent.includes("gm")) {
    const introMessage = `
Gm! 👋 Welcome to DeFi Treasure League!

🏴‍☠️ Hunt for crypto treasures and manage your DeFi portfolio in this exciting game!

To get started:
• Use /create_team [team_name] to create a new team
• Or use /list_teams to see existing teams you can join
• Join a team with /join_team [team_name]

Once you're in a team, you can solve puzzles and earn points! 🧩💰

Good luck and have fun! 🚀
    `;
    await context.reply(introMessage);
  } else {
    await context.reply(
      "Hello! If you're looking to interact with the game, please type 'gm' to get started."
    );
  }
}

async function checkAndPostPuzzle(context: HandlerContext) {
  const currentPuzzle = await getCurrentPuzzle();
  if (!currentPuzzle) {
    await postNewPuzzle(context);
  }
}
