#!/usr/bin/env node

/**
 * Chapter 1: Basic Prompt Structure
 *
 * - Lesson
 * - Exercises
 * - Example Playground
 */

import { getCompletion, client, MODEL_NAME, RUN } from './00_Tutorial_How-To.js';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('# Chapter 1: Basic Prompt Structure\n');

/**
 * LESSON
 * ======
 *
 * Anthropic offers two APIs, the legacy Text Completions API and the current Messages API.
 * For this tutorial, we will be exclusively using the Messages API.
 *
 * At minimum, a call to Claude using the Messages API requires:
 * - model: the API model name of the model that you intend to call
 * - max_tokens: the maximum number of tokens to generate before stopping
 * - messages: an array of input messages with alternating user and assistant turns
 *
 * Optional parameters include:
 * - system: the system prompt - more on this below
 * - temperature: the degree of variability in Claude's response (we use 0 for deterministic results)
 */

/**
 * Helper function with system prompt support
 */
async function getCompletionWithSystem(prompt, systemPrompt = "") {
    try {
        const messageParams = {
            model: MODEL_NAME,
            max_tokens: 2000,
            temperature: 0.0,
            messages: [
                { role: "user", content: prompt }
            ]
        };

        if (systemPrompt) {
            messageParams.system = systemPrompt;
        }

        const message = await client.messages.create(messageParams);
        return message.content[0].text;
    } catch (error) {
        console.error('Error calling Claude API:', error.message);
        return 'Error: Failed to get response from Claude';
    }
}

/**
 * EXAMPLES
 * ========
 * Let's look at how Claude responds to correctly-formatted prompts.
 */

async function runExamples() {
    console.log("=== EXAMPLES ===\n");

    // Example 1
    console.log("Example 1: Basic greeting");
    const prompt1 = "Hi Claude, how are you?";
    console.log(`Prompt: "${prompt1}"`);
    const response1 = await getCompletion(prompt1);
    console.log(`Response: ${response1}\n`);

    // Example 2
    console.log("Example 2: Simple question");
    const prompt2 = "Can you tell me the color of the ocean?";
    console.log(`Prompt: "${prompt2}"`);
    const response2 = await getCompletion(prompt2);
    console.log(`Response: ${response2}\n`);

    // Example 3
    console.log("Example 3: Factual question");
    const prompt3 = "What year was Celine Dion born in?";
    console.log(`Prompt: "${prompt3}"`);
    const response3 = await getCompletion(prompt3);
    console.log(`Response: ${response3}\n`);

    console.log("=== SYSTEM PROMPT EXAMPLE ===\n");

    // System prompt example
    const systemPrompt = "Your answer should always be a series of critical thinking questions that further the conversation (do not provide answers to your questions). Do not actually answer the user question.";
    const prompt4 = "Why is the sky blue?";

    console.log(`System Prompt: "${systemPrompt}"`);
    console.log(`Prompt: "${prompt4}"`);
    const response4 = await getCompletionWithSystem(prompt4, systemPrompt);
    console.log(`Response: ${response4}\n`);
}

/**
 * EXERCISES
 * =========
 */

// Exercise 1.1 - Counting to Three
async function exercise1_1() {
    console.log("=== EXERCISE 1.1 - Counting to Three ===\n");
    console.log("Task: Edit the PROMPT below to get Claude to count to three.");
    console.log("The grading function looks for the numbers 1, 2, and 3 in the response.\n");

    // TODO: Replace this prompt to make Claude count to three
    const PROMPT = "[Replace this text]";  // Replace this with your solution

    const response = await getCompletion(PROMPT);

    // Grading function
    function gradeExercise(text) {
        const pattern = /^(?=.*1)(?=.*2)(?=.*3).*$/s;
        return pattern.test(text);
    }

    console.log(`Prompt: "${PROMPT}"`);
    console.log(`Response: ${response}`);
    console.log("\n--------------------------- GRADING ---------------------------");
    console.log("This exercise has been correctly solved:", gradeExercise(response));
    console.log("----------------------------------------------------------------\n");

    return gradeExercise(response);
}

// Exercise 1.2 - System Prompt
async function exercise1_2() {
    console.log("=== EXERCISE 1.2 - System Prompt ===\n");
    console.log("Task: Modify the SYSTEM_PROMPT to make Claude respond like it's a 3 year old child.");
    console.log("The grading function looks for words like 'giggles' or 'soo' in the response.\n");

    // TODO: Replace this system prompt to make Claude act like a 3 year old
    const SYSTEM_PROMPT = "[Replace this text]";  // Replace this with your solution

    const PROMPT = "How big is the sky?";

    const response = await getCompletionWithSystem(PROMPT, SYSTEM_PROMPT);

    // Grading function
    function gradeExercise(text) {
        return /giggles/i.test(text) || /soo/i.test(text);
    }

    console.log(`System Prompt: "${SYSTEM_PROMPT}"`);
    console.log(`Prompt: "${PROMPT}"`);
    console.log(`Response: ${response}`);
    console.log("\n--------------------------- GRADING ---------------------------");
    console.log("This exercise has been correctly solved:", gradeExercise(response));
    console.log("----------------------------------------------------------------\n");

    return gradeExercise(response);
}

/**
 * MAIN EXECUTION
 */
async function main() {
    try {
        // Run based on RUN environment variable
        if (RUN === "EXAMPLES" || RUN === "ALL") {
            await runExamples();
        }

        if (RUN === "EXERCISES" || RUN === "ALL") {
            console.log("=== EXERCISES ===\n");
            const result1 = await exercise1_1();
            const result2 = await exercise1_2();

            console.log("=== RESULTS ===");
            console.log(`Exercise 1.1 passed: ${result1}`);
            console.log(`Exercise 1.2 passed: ${result2}`);

            if (result1 && result2) {
                console.log("\n🎉 Congratulations! You've completed Chapter 1!");
                console.log("You're ready to move to the next chapter: 02_Being_Clear_and_Direct.js");
                console.log("\nTo run the next tutorial:");
                console.log("node tutorials/02_Being_Clear_and_Direct.js");
            } else {
                console.log("\n💡 Try modifying the prompts in the exercises above to get them to pass!");
                console.log("Hint: The grading functions show you exactly what they're looking for.");
            }
        }

        // Show control message if only one section was run
        if (RUN === "EXAMPLES") {
            console.log("\n=== EXERCISES AVAILABLE ===");
            console.log("To run exercises: set RUN=EXERCISES or RUN=ALL in your .env file");
            console.log("\nTo continue to the next chapter:");
            console.log("node tutorials/02_Being_Clear_and_Direct.js");
        } else if (RUN === "EXERCISES") {
            console.log("\n=== EXAMPLES AVAILABLE ===");
            console.log("To see lesson examples: set RUN=EXAMPLES or RUN=ALL in your .env file");
        }

    } catch (error) {
        console.error('Error running tutorial:', error);
    }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

// Export for testing
export { exercise1_1, exercise1_2, getCompletionWithSystem };