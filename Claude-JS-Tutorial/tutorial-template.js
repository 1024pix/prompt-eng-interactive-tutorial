#!/usr/bin/env node

/**
 * Chapter X: [CHAPTER_TITLE]
 *
 * Template for creating JavaScript tutorial files
 * Replace placeholders with actual content
 */

import { getCompletion, client, MODEL_NAME, RUN } from './00_Tutorial_How-To.js';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('# Chapter X: [CHAPTER_TITLE]\n');

/**
 * Helper function with system prompt support
 */
async function getCompletionWithSystem(prompt, systemPrompt = "") {
    try {
        const messageParams = {
            model: MODEL_NAME,
            max_tokens: 2000, // Adjust if needed for longer responses
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
 * [Add lesson content here]
 */

async function runExamples() {
    console.log("=== LESSON EXAMPLES ===\n");

    // Example 1
    console.log("Example 1: [Description]");
    const prompt1 = "[Example prompt]";
    console.log(`Prompt: "${prompt1}"`);
    const response1 = await getCompletion(prompt1);
    console.log(`Response: ${response1}\n`);

    // Add more examples as needed
}

/**
 * EXERCISES
 * =========
 */

// Exercise X.1 - [Exercise Title]
async function exerciseX_1() {
    console.log("=== EXERCISE X.1 - [Exercise Title] ===\n");
    console.log("Task: [Description of what to do]");
    console.log("The grading function looks for [what it checks for].\n");

    // TODO: Modify these variables
    const SYSTEM_PROMPT = "[Replace this text]"; // Modify as needed
    const PROMPT = "[Replace this text]"; // Modify this

    const response = await getCompletionWithSystem(PROMPT, SYSTEM_PROMPT);

    // Grading function - customize based on exercise requirements
    function gradeExercise(text) {
        // Replace with actual grading logic
        return text.toLowerCase().includes("expected_text");
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
            const result1 = await exerciseX_1();
            // Add more exercises as needed

            console.log("=== RESULTS ===");
            console.log(`Exercise X.1 passed: ${result1}`);

            if (result1) {
                console.log("\n🎉 Congratulations! You've completed Chapter X!");
                console.log("You're ready to move to the next chapter: [NEXT_CHAPTER].js");
                console.log("\nTo run the next tutorial:");
                console.log("node tutorials/[NEXT_CHAPTER].js");
            } else {
                console.log("\n💡 Try modifying the prompts in the exercises above to get them to pass!");
                console.log("[Add specific hints about the chapter topic]");
            }
        }

        // Show control message if only one section was run
        if (RUN === "EXAMPLES") {
            console.log("\n=== EXERCISES AVAILABLE ===");
            console.log("To run exercises: set RUN=EXERCISES or RUN=ALL in your .env file");
            console.log("\nTo continue to the next chapter:");
            console.log("node tutorials/[NEXT_CHAPTER].js");
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
export { exerciseX_1, getCompletionWithSystem };