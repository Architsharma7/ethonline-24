import { run, HandlerContext } from "@xmtp/message-kit";

run(async (context: HandlerContext) => {
  // Get the message and the address from the sender
  const { content, sender } = context.message;
  console.log(`[${sender.address}]: ${content.content}`);

  // To reply, just call `reply` on the HandlerContext.
  const reply = await context.reply("Your message.");
  console.log(reply);
});
