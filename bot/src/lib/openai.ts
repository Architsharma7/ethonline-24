import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function textGeneration(
  prompt: string,
  systemPrompt: string
): Promise<{ reply: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: 150, 
      temperature: 0.7, 
    });

    const reply = response.choices[0].message.content;
    return { reply: reply || "NIL" };
  } catch (error) {
    console.error("Error in OpenAI text generation:", error);
    throw error;
  }
}
