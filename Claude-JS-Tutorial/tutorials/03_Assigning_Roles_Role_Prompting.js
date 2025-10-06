#!/usr/bin/env node

/**
 * Chapter 3: Assigning Roles (Role Prompting)
 *
 * - Lesson
 * - Exercises
 * - Example Playground
 */

import { getCompletion, client, MODEL_NAME, RUN } from './00_Tutorial_How-To.js';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('# Chapter 3: Assigning Roles (Role Prompting)\n');

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
 * LESSON
 * ======
 *
 * Continuing on the theme of Claude having no context aside from what you say,
 * it's sometimes important to prompt Claude to inhabit a specific role (including
 * all necessary context). This is also known as role prompting. The more detail
 * to the role context, the better.
 *
 * Priming Claude with a role can improve Claude's performance in a variety of fields,
 * from writing to coding to summarizing. It's like how humans can sometimes be helped
 * when told to "think like a ______". Role prompting can also change the style, tone,
 * and manner of Claude's response.
 *
 * Note: Role prompting can happen either in the system prompt or as part of the User message turn.
 */

async function runExamples() {
    console.log("=== LESSON EXAMPLES ===\n");

    // Example 1: Without role prompting
    console.log("Example 1: Without role prompting");
    const prompt1 = "In one sentence, what do you think about skateboarding?";
    console.log(`Prompt: "${prompt1}"`);
    const response1 = await getCompletion(prompt1);
    console.log(`Response: ${response1}\n`);

    // Example 2: With role prompting (cat)
    console.log("Example 2: With role prompting (You are a cat)");
    const systemPrompt2 = "You are a cat.";
    const prompt2 = "In one sentence, what do you think about skateboarding?";
    console.log(`System Prompt: "${systemPrompt2}"`);
    console.log(`Prompt: "${prompt2}"`);
    const response2 = await getCompletionWithSystem(prompt2, systemPrompt2);
    console.log(`Response: ${response2}\n`);

    // Example 3: Logic problem without role prompting
    console.log("Example 3: Logic problem without role prompting");
    const prompt3 = "Jack is looking at Anne. Anne is looking at George. Jack is married, George is not, and we don't know if Anne is married. Is a married person looking at an unmarried person?";
    console.log(`Prompt: "${prompt3}"`);
    const response3 = await getCompletion(prompt3);
    console.log(`Response: ${response3}\n`);

    // Example 4: Logic problem with role prompting
    console.log("Example 4: Logic problem with role prompting (logic bot)");
    const systemPrompt4 = "You are a logic bot designed to answer complex logic problems.";
    const prompt4 = "Jack is looking at Anne. Anne is looking at George. Jack is married, George is not, and we don't know if Anne is married. Is a married person looking at an unmarried person?";
    console.log(`System Prompt: "${systemPrompt4}"`);
    console.log(`Prompt: "${prompt4}"`);
    const response4 = await getCompletionWithSystem(prompt4, systemPrompt4);
    console.log(`Response: ${response4}\n`);
}

/**
 * EXERCISES
 * =========
 */

// Exercise 3.1 - Math Correction
async function exercise3_1() {
    console.log("=== EXERCISE 3.1 - Math Correction ===\n");
    console.log("Task: Claude incorrectly assesses the math problem below as correctly solved,");
    console.log("even though there's an obvious arithmetic mistake in the second step.");
    console.log("Modify the PROMPT and/or SYSTEM_PROMPT to make Claude grade the solution as incorrectly solved.");
    console.log("The grading function looks for 'incorrect' or 'not correct' in the response.\n");

    // TODO: Modify this system prompt to help Claude be better at math
    const SYSTEM_PROMPT = "[Replace this text]"; // Modify this

    // TODO: You can also modify this prompt if needed
    const PROMPT = `Is this equation solved correctly below?

2x - 3 = 9
2x = 6
x = 3`; // You can modify this too if needed

    const response = await getCompletionWithSystem(PROMPT, SYSTEM_PROMPT);

    // Grading function
    function gradeExercise(text) {
        return text.toLowerCase().includes("incorrect") || text.toLowerCase().includes("not correct");
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
            const result1 = await exercise3_1();

            console.log("=== RESULTS ===");
            console.log(`Exercise 3.1 passed: ${result1}`);

            if (result1) {
                console.log("\n🎉 Congratulations! You've completed Chapter 3!");
                console.log("You're ready to move to the next chapter: 04_Separating_Data_and_Instructions.js");
                console.log("\nTo run the next tutorial:");
                console.log("node tutorials/04_Separating_Data_and_Instructions.js");
            } else {
                console.log("\n💡 Try giving Claude a role that would make it better at math!");
                console.log("Remember: Role prompting can improve Claude's performance in specific domains.");
            }
        }

        // Show control message if only one section was run
        if (RUN === "EXAMPLES") {
            console.log("\n=== EXERCISES AVAILABLE ===");
            console.log("To run exercises: set RUN=EXERCISES or RUN=ALL in your .env file");
            console.log("\nTo continue to the next chapter:");
            console.log("node tutorials/04_Separating_Data_and_Instructions.js");
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
export { exercise3_1, getCompletionWithSystem };