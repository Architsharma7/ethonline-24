import { StackClient } from "@stackso/js-core";

let stackClient: StackClient | null = null;

export function initializeStackClient() {
  if (!process.env.STACK_API_KEY) {
    console.error("STACK_API_KEY not found in environment variables");
    return null;
  }

  stackClient = new StackClient({
    apiKey: process.env.STACKS_API_KEY as string,
    pointSystemId: 3382,
  });

  return stackClient;
}

export function getStackClient() {
  if (!stackClient) {
    return initializeStackClient();
  }
  return stackClient;
}
