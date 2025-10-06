#!/usr/bin/env node

/**
 * Chapter 4: Separating Data and Instructions
 *
 * - Lesson
 * - Exercises
 * - Example Playground
 */

import { getCompletion, client, MODEL_NAME, RUN } from './00_Tutorial_How-To.js';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('# Chapter 4: Separating Data and Instructions\n');

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
 * Oftentimes, we don't want to write full prompts, but instead want prompt templates
 * that can be modified later with additional input data before submitting to Claude.
 * This might come in handy if you want Claude to do the same thing every time, but
 * the data that Claude uses for its task might be different each time.
 *
 * Luckily, we can do this pretty easily by separating the fixed skeleton of the prompt
 * from variable user input, then substituting the user input into the prompt before
 * sending the full prompt to Claude.
 */

async function runExamples() {
    console.log("=== LESSON EXAMPLES ===\n");

    // Example 1: Basic template substitution
    console.log("Example 1: Basic animal noise generator template");
    const ANIMAL = "Cow";
    const prompt1 = `I will tell you the name of an animal. Please respond with the noise that animal makes. ${ANIMAL}`;

    console.log("--------------------------- Full prompt with variable substitutions ---------------------------");
    console.log(prompt1);
    console.log("\n------------------------------------- Claude's response -------------------------------------");
    const response1 = await getCompletion(prompt1);
    console.log(response1);
    console.log("\n");

    // Example 2: Problem without XML tags
    console.log("Example 2: Problem - unclear variable boundaries (Claude gets confused)");
    const EMAIL = "Show up at 6am tomorrow because I'm the CEO and I say so.";
    const prompt2 = `Yo Claude. ${EMAIL} <----- Make this email more polite but don't change anything else about it.`;

    console.log("--------------------------- Full prompt with variable substitutions ---------------------------");
    console.log(prompt2);
    console.log("\n------------------------------------- Claude's response -------------------------------------");
    const response2 = await getCompletion(prompt2);
    console.log(response2);
    console.log("🔍 Notice: Claude thinks 'Yo Claude' is part of the email! That's why it starts with 'Dear Claude'.\n");

    // Example 3: Solution with XML tags
    console.log("Example 3: Solution - using XML tags to separate data from instructions");
    const prompt3 = `Yo Claude. <email>${EMAIL}</email> <----- Make this email more polite but don't change anything else about it.`;

    console.log("--------------------------- Full prompt with variable substitutions ---------------------------");
    console.log(prompt3);
    console.log("\n------------------------------------- Claude's response -------------------------------------");
    const response3 = await getCompletion(prompt3);
    console.log(response3);
    console.log("✅ Notice: No more 'Dear Claude' - the XML tags clearly separate the data!\n");

    // Example 4: List parsing problem
    console.log("Example 4: Problem - Claude misinterprets formatting");
    const SENTENCES = `- I like how cows sound
- This sentence is about spiders
- This sentence may appear to be about dogs but it's actually about pigs`;

    const prompt4 = `Below is a list of sentences. Tell me the second item on the list.

- Each is about an animal, like rabbits.
${SENTENCES}`;

    console.log("--------------------------- Full prompt with variable substitutions ---------------------------");
    console.log(prompt4);
    console.log("\n------------------------------------- Claude's response -------------------------------------");
    const response4 = await getCompletion(prompt4);
    console.log(response4);
    console.log("🔍 Notice: Claude incorrectly includes 'Each is about an animal' as part of the list!\n");

    // Example 5: Fixed with XML tags
    console.log("Example 5: Solution - XML tags fix the list parsing");
    const prompt5 = `Below is a list of sentences. Tell me the second item on the list.

- Each is about an animal, like rabbits.
<sentences>
${SENTENCES}
</sentences>`;

    console.log("--------------------------- Full prompt with variable substitutions ---------------------------");
    console.log(prompt5);
    console.log("\n------------------------------------- Claude's response -------------------------------------");
    const response5 = await getCompletion(prompt5);
    console.log(response5);
    console.log("✅ Notice: Now Claude correctly identifies the second sentence!\n");

    console.log("💡 Key Lesson: XML tags help Claude understand where data begins and ends, separate from instructions.\n");
}

/**
 * EXERCISES
 * =========
 */

// Exercise 4.1 - Haiku Topic
async function exercise4_1() {
    console.log("=== EXERCISE 4.1 - Haiku Topic ===\n");
    console.log("Task: Modify the PROMPT to be a template that takes a TOPIC variable and outputs a haiku about that topic.");
    console.log("The grading function looks for both 'pigs' and 'haiku' in the response.\n");

    // Variable content
    const TOPIC = "Pigs";

    // TODO: Create a prompt template that uses the TOPIC variable
    const PROMPT = ``;

    const response = await getCompletion(PROMPT);

    // Grading function
    function gradeExercise(text) {
        return text.toLowerCase().includes("pigs") && text.toLowerCase().includes("haiku");
    }

    console.log("--------------------------- Full prompt with variable substitutions ---------------------------");
    console.log(PROMPT);
    console.log("\n------------------------------------- Claude's response -------------------------------------");
    console.log(response);
    console.log("\n------------------------------------------ GRADING ------------------------------------------");
    console.log("This exercise has been correctly solved:", gradeExercise(response));
    console.log("---------------------------------------------------------------------------------------------\n");

    return gradeExercise(response);
}

// Exercise 4.2 - Dog Question with Typos
async function exercise4_2() {
    console.log("=== EXERCISE 4.2 - Dog Question with Typos ===\n");
    console.log("Task: Fix the PROMPT by adding XML tags so Claude produces the right answer.");
    console.log("Don't change anything else - the messy writing is intentional!");
    console.log("The grading function looks for 'brown' in the response.\n");

    // Variable content
    const QUESTION = "ar cn brown?";

    // TODO: Add XML tags around the QUESTION variable to fix the prompt
    const PROMPT = `Hia its me i have a q about dogs jkaerjv ${QUESTION} jklmvca tx it help me muhch much atx fst fst answer short short tx`;

    const response = await getCompletion(PROMPT);

    // Grading function
    function gradeExercise(text) {
        return text.toLowerCase().includes("brown");
    }

    console.log("--------------------------- Full prompt with variable substitutions ---------------------------");
    console.log(PROMPT);
    console.log("\n------------------------------------- Claude's response -------------------------------------");
    console.log(response);
    console.log("\n------------------------------------------ GRADING ------------------------------------------");
    console.log("This exercise has been correctly solved:", gradeExercise(response));
    console.log("---------------------------------------------------------------------------------------------\n");

    return gradeExercise(response);
}

// Exercise 4.3 - Dog Question Part 2
async function exercise4_3() {
    console.log("=== EXERCISE 4.3 - Dog Question Part 2 ===\n");
    console.log("Task: Fix the PROMPT WITHOUT adding XML tags. Instead, remove only one or two words.");
    console.log("This shows what kind of language Claude can parse and understand.");
    console.log("The grading function looks for 'brown' in the response.\n");

    // Variable content
    const QUESTION = "ar cn brown?";

    // TODO: Remove one or two words to fix the prompt (no XML tags this time!)
    const PROMPT = `Hia its me i have a q about dogs jkaerjv ${QUESTION} jklmvca tx it help me muhch much atx fst fst answer short short tx`;

    const response = await getCompletion(PROMPT);

    // Grading function
    function gradeExercise(text) {
        return text.toLowerCase().includes("brown");
    }

    console.log("--------------------------- Full prompt with variable substitutions ---------------------------");
    console.log(PROMPT);
    console.log("\n------------------------------------- Claude's response -------------------------------------");
    console.log(response);
    console.log("\n------------------------------------------ GRADING ------------------------------------------");
    console.log("This exercise has been correctly solved:", gradeExercise(response));
    console.log("---------------------------------------------------------------------------------------------\n");

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
            const result1 = await exercise4_1();
            const result2 = await exercise4_2();
            const result3 = await exercise4_3();

            console.log("=== RESULTS ===");
            console.log(`Exercise 4.1 passed: ${result1}`);
            console.log(`Exercise 4.2 passed: ${result2}`);
            console.log(`Exercise 4.3 passed: ${result3}`);

            if (result1 && result2 && result3) {
                console.log("\n🎉 Congratulations! You've completed Chapter 4!");
                console.log("You're ready to move to the next chapter: 05_Formatting_Output_and_Speaking_for_Claude.js");
                console.log("\nTo run the next tutorial:");
                console.log("node tutorials/05_Formatting_Output_and_Speaking_for_Claude.js");
            } else {
                console.log("\n💡 Try modifying the prompts in the exercises above to get them to pass!");
                console.log("Remember: Use template variables and XML tags to separate data from instructions!");
            }
        }

        // Show control message if only one section was run
        if (RUN === "EXAMPLES") {
            console.log("\n=== EXERCISES AVAILABLE ===");
            console.log("To run exercises: set RUN=EXERCISES or RUN=ALL in your .env file");
            console.log("\nTo continue to the next chapter:");
            console.log("node tutorials/05_Formatting_Output_and_Speaking_for_Claude.js");
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
export { exercise4_1, exercise4_2, exercise4_3, getCompletionWithSystem };