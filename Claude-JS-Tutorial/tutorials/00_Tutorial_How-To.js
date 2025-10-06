#!/usr/bin/env node

/**
 * Tutorial How-To - JavaScript Edition
 *
 * This tutorial **requires an API key** for interaction. If you don't have an API key,
 * you can sign up for one via the Anthropic Console (https://console.anthropic.com/)
 * or view our static tutorial answer key instead.
 */

import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('# Tutorial How-To - JavaScript Edition\n');

/**
 * How to get started:
 *
 * 1. Clone this repository to your local machine.
 *
 * 2. Install the required dependencies by running:
 *    npm install
 *
 * 3. Set up your API key and model name by copying .env.example to .env
 *    and replacing "your_api_key_here" with your actual Anthropic API key.
 *
 * 4. Run the tutorial files using Node.js, following the instructions provided.
 */

// Configuration
const API_KEY = process.env.ANTHROPIC_API_KEY || "your_api_key_here";
const MODEL_NAME = process.env.MODEL_NAME || "claude-3-haiku-20240307";
const RUN = (process.env.RUN || "EXAMPLES").toUpperCase();

if (API_KEY === "your_api_key_here") {
    console.error("❌ Please set your ANTHROPIC_API_KEY in the .env file before continuing.");
    console.log("Copy .env.example to .env and add your actual API key.\n");
    process.exit(1);
}

console.log("✅ API key configured successfully!\n");

/**
 * Usage Notes & Tips 💡
 *
 * - This course uses Claude 3 Haiku with temperature 0. We will talk more about temperature
 *   later in the course. For now, it's enough to understand that these settings yield more
 *   deterministic results. All prompt engineering techniques in this course also apply to
 *   previous generation legacy Claude models such as Claude 2 and Claude Instant 1.2.
 *
 * - You can run each tutorial file individually using `node tutorials/filename.js`
 *
 * - When you finish a tutorial, navigate to the next numbered file in the tutorials folder.
 *
 * The Anthropic SDK & the Messages API
 * We will be using the Anthropic JavaScript SDK and the Messages API throughout this tutorial.
 *
 * Below is an example of what running a prompt will look like in this tutorial. First, we create
 * `getCompletion`, which is a helper function that sends a prompt to Claude and returns Claude's
 * generated response.
 */

// Initialize the Anthropic client
const client = new Anthropic({
    apiKey: API_KEY,
});

/**
 * Helper function that sends a prompt to Claude and returns the response
 * @param {string} prompt - The prompt to send to Claude
 * @returns {Promise<string>} - Claude's response
 */
async function getCompletion(prompt) {
    try {
        const message = await client.messages.create({
            model: MODEL_NAME,
            max_tokens: 2000,
            temperature: 0.0,
            messages: [
                { role: "user", content: prompt }
            ]
        });
        return message.content[0].text;
    } catch (error) {
        console.error('Error calling Claude API:', error.message);
        return 'Error: Failed to get response from Claude';
    }
}

/**
 * Now we will write out an example prompt for Claude and print Claude's output
 * by running our `getCompletion` helper function. Running this will print out
 * a response from Claude.
 *
 * Feel free to modify the prompt string to elicit different responses from Claude.
 */

async function runExample() {
    console.log("🤖 Running example prompt...\n");

    // Prompt
    const prompt = "Hello, Claude!";

    console.log(`Prompt: "${prompt}"\n`);

    // Get Claude's response
    const response = await getCompletion(prompt);
    console.log("Claude's response:");
    console.log(response);
    console.log("\n" + "=".repeat(50) + "\n");

    console.log("🎉 Great! Your setup is working correctly.");
    console.log("You can now proceed to the next tutorial: 01_Basic_Prompt_Structure.js");
    console.log("\nTo run the next tutorial:");
    console.log("node tutorials/01_Basic_Prompt_Structure.js");
}

// Export the helper function and config for use in other tutorials
export { getCompletion, client, MODEL_NAME, RUN };

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runExample().catch(console.error);
}