import { GoogleGenAI } from "@google/genai";

export let ai;

export const initializeAi = () => {
  ai = new GoogleGenAI({});
};

/**
 * Asks gemini to to summarize the provided text.
 * @param {string} textToCram The text you want summarized.
 * @returns {string} A string containing the summarized text.
 */
export async function cramIt(textToCram) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents:
      "Your goal is to summarize information in a Discord chat between friends." +
      "\nYou have a character limit of 1500 characters." +
      "\nTreat backslash-n (\\n) as a linebreak if you see it in the text." +
      "\nTime sensitive information and commands directed towards someone should be prioritized," +
      " but include as much info as you can in the character limit." +
      "\nThe name of the person who posted the message is between double asterisks followed by a colon." +
      " It will be above the text that the user said." +
      "\nTry to keep conversations in chronological order." +
      "\nIf a link is important for the context of the conversation, please provide it; otherwise, it may be excluded." +
      "\nYou are replying in Discord, so you may use the markup language allowed in Discord," +
      " but keep in mind that this contributes to your total character limit." +
      "\nAs always, thank you for your hard work!\n\n\n" +
      textToCram,
  });
  return response.text;
}
