#!/usr/bin/env node

/**
 * Chapter 2: Being Clear and Direct
 *
 * - Lesson
 * - Exercises
 * - Example Playground
 */

import { getCompletion, client, MODEL_NAME, RUN } from './00_Tutorial_How-To.js';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('# Chapter 2: Being Clear and Direct\n');

/**
 * Helper function with system prompt support and higher token limit for this chapter
 */
async function getCompletionWithSystem(prompt, systemPrompt = "") {
    try {
        const messageParams = {
            model: MODEL_NAME,
            max_tokens: 4000, // Increased for longer completions in exercises
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
 * LESSON
 * ======
 *
 * Claude responds best to clear and direct instructions.
 *
 * Think of Claude like any other human that is new to the job. Claude has no context
 * on what to do aside from what you literally tell it. Just as when you instruct a human
 * for the first time on a task, the more you explain exactly what you want in a
 * straightforward manner to Claude, the better and more accurate Claude's response will be.
 *
 * Golden Rule of Clear Prompting:
 * Show your prompt to a colleague or friend and have them follow the instructions themselves
 * to see if they can produce the result you want. If they're confused, Claude's confused.
 */

async function runExamples() {
    console.log("=== LESSON EXAMPLES ===\n");

    // Example 1: Basic haiku request
    console.log("Example 1: Basic haiku request");
    const prompt1 = "Write a haiku about robots.";
    console.log(`Prompt: "${prompt1}"`);
    const response1 = await getCompletion(prompt1);
    console.log(`Response: ${response1}\n`);

    // Example 2: More direct haiku request
    console.log("Example 2: More direct haiku request (skip preamble)");
    const prompt2 = "Write a haiku about robots. Skip the preamble; go straight into the poem.";
    console.log(`Prompt: "${prompt2}"`);
    const response2 = await getCompletion(prompt2);
    console.log(`Response: ${response2}\n`);

    // Example 3: Basketball player question (equivocal)
    console.log("Example 3: Basketball player question (equivocal)");
    const prompt3 = "Who is the best basketball player of all time?";
    console.log(`Prompt: "${prompt3}"`);
    const response3 = await getCompletion(prompt3);
    console.log(`Response: ${response3}\n`);

    // Example 4: Basketball player question (definitive)
    console.log("Example 4: Basketball player question (forcing a definitive answer)");
    const prompt4 = "Who is the best basketball player of all time? Yes, there are differing opinions, but if you absolutely had to pick one player, who would it be?";
    console.log(`Prompt: "${prompt4}"`);
    const response4 = await getCompletion(prompt4);
    console.log(`Response: ${response4}\n`);
}

/**
 * EXERCISES
 * =========
 */

// Exercise 2.1 - Spanish
async function exercise2_1() {
    console.log("=== EXERCISE 2.1 - Spanish ===\n");
    console.log("Task: Modify the SYSTEM_PROMPT to make Claude output its answer in Spanish.");
    console.log("The grading function looks for the word 'hola' in the response.\n");

    // TODO: Replace this system prompt to make Claude respond in Spanish
    const SYSTEM_PROMPT = "[Replace this text]"; // Replace this with your solution

    const PROMPT = "Hello Claude, how are you?";

    const response = await getCompletionWithSystem(PROMPT, SYSTEM_PROMPT);

    // Grading function
    function gradeExercise(text) {
        return text.toLowerCase().includes("hola");
    }

    console.log(`System Prompt: "${SYSTEM_PROMPT}"`);
    console.log(`Prompt: "${PROMPT}"`);
    console.log(`Response: ${response}`);
    console.log("\n--------------------------- GRADING ---------------------------");
    console.log("This exercise has been correctly solved:", gradeExercise(response));
    console.log("----------------------------------------------------------------\n");

    return gradeExercise(response);
}

// Exercise 2.2 - One Player Only
async function exercise2_2() {
    console.log("=== EXERCISE 2.2 - One Player Only ===\n");
    console.log("Task: Modify the PROMPT so Claude responds with ONLY the name of one specific player,");
    console.log("with no other words or punctuation. The expected answer is exactly 'Michael Jordan'.\n");

    // TODO: Replace this prompt to get exactly "Michael Jordan" as the response
    const PROMPT = "[Replace this text]"; // Replace this with your solution

    const response = await getCompletion(PROMPT);

    // Grading function
    function gradeExercise(text) {
        return text.trim() === "Michael Jordan";
    }

    console.log(`Prompt: "${PROMPT}"`);
    console.log(`Response: "${response}"`);
    console.log("\n--------------------------- GRADING ---------------------------");
    console.log("This exercise has been correctly solved:", gradeExercise(response));
    console.log("----------------------------------------------------------------\n");

    return gradeExercise(response);
}

// Exercise 2.3 - Write a Story
async function exercise2_3() {
    console.log("=== EXERCISE 2.3 - Write a Story ===\n");
    console.log("Task: Modify the PROMPT so Claude responds with a long response.");
    console.log("If your answer is over 800 words, it will be graded as correct.\n");

    // TODO: Replace this prompt to get a response over 800 words
    const PROMPT = "[Replace this text]"; // Replace this with your solution

    const response = await getCompletion(PROMPT);

    // Grading function
    function gradeExercise(text) {
        const trimmed = text.trim();
        const words = trimmed.split(/\s+/).length;
        console.log(`Word count: ${words}`);
        return words >= 800;
    }

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
            const result1 = await exercise2_1();
            const result2 = await exercise2_2();
            const result3 = await exercise2_3();

            console.log("=== RESULTS ===");
            console.log(`Exercise 2.1 passed: ${result1}`);
            console.log(`Exercise 2.2 passed: ${result2}`);
            console.log(`Exercise 2.3 passed: ${result3}`);

            if (result1 && result2 && result3) {
                console.log("\n🎉 Congratulations! You've completed Chapter 2!");
                console.log("You're ready to move to the next chapter: 03_Assigning_Roles_Role_Prompting.js");
                console.log("\nTo run the next tutorial:");
                console.log("node tutorials/03_Assigning_Roles_Role_Prompting.js");
            } else {
                console.log("\n💡 Try modifying the prompts in the exercises above to get them to pass!");
                console.log("Remember: Be clear and direct with your instructions!");
            }
        }

        // Show control message if only one section was run
        if (RUN === "EXAMPLES") {
            console.log("\n=== EXERCISES AVAILABLE ===");
            console.log("To run exercises: set RUN=EXERCISES or RUN=ALL in your .env file");
            console.log("\nTo continue to the next chapter:");
            console.log("node tutorials/03_Assigning_Roles_Role_Prompting.js");
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
export { exercise2_1, exercise2_2, exercise2_3, getCompletionWithSystem };