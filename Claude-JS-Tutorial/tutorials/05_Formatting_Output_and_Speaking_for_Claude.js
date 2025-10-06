#!/usr/bin/env node

/**
 * Chapter 5: Formatting Output and Speaking for Claude
 *
 * Learn how to format Claude's output using XML tags and JSON,
 * and how to prefill Claude's responses for better control.
 */

import { getCompletion, client, MODEL_NAME, RUN } from './00_Tutorial_How-To.js';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('# Chapter 5: Formatting Output and Speaking for Claude\n');

/**
 * Helper function to get completion with system prompt AND prefill support
 * Prefilling allows you to "speak for Claude" by starting its response
 */
async function getCompletionWithPrefill(prompt, systemPrompt = "", prefill = "") {
    try {
        const messages = [
            { role: "user", content: prompt }
        ];

        // Add assistant message with prefill if provided
        if (prefill) {
            messages.push({ role: "assistant", content: prefill });
        }

        const response = await client.messages.create({
            model: MODEL_NAME,
            max_tokens: 2000,
            temperature: 0.0,
            system: systemPrompt || undefined,
            messages: messages
        });

        return response.content[0].text;
    } catch (error) {
        console.error('Error calling Claude API:', error.message);
        throw error;
    }
}

// ============================================================================
// EXAMPLES - Learn about output formatting and prefilling
// ============================================================================

async function runExamples() {
    console.log('========================================');
    console.log('EXAMPLES - Output Formatting & Prefilling');
    console.log('========================================\n');

    // Example 1: Basic XML tag formatting
    console.log('--- Example 1: XML Tags for Output Formatting ---\n');
    const ANIMAL1 = "Rabbit";
    const PROMPT1 = `Please write a haiku about ${ANIMAL1}. Put it in <haiku> tags.`;

    console.log('Prompt:', PROMPT1);
    const response1 = await getCompletionWithPrefill(PROMPT1);
    console.log('\nClaude\'s response:');
    console.log(response1);
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 2: Prefilling with XML tag
    console.log('--- Example 2: Prefilling Claude\'s Response ---\n');
    const ANIMAL2 = "Cat";
    const PROMPT2 = `Please write a haiku about ${ANIMAL2}. Put it in <haiku> tags.`;
    const PREFILL2 = "<haiku>";

    console.log('USER TURN:');
    console.log(PROMPT2);
    console.log('\nASSISTANT TURN:');
    console.log(PREFILL2);

    const response2 = await getCompletionWithPrefill(PROMPT2, "", PREFILL2);
    console.log('\nClaude\'s response:');
    console.log(response2);
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 3: JSON output formatting with prefill
    console.log('--- Example 3: JSON Output Format ---\n');
    const ANIMAL3 = "Cat";
    const PROMPT3 = `Please write a haiku about ${ANIMAL3}. Use JSON format with the keys as "first_line", "second_line", and "third_line".`;
    const PREFILL3 = "{";

    console.log('USER TURN:');
    console.log(PROMPT3);
    console.log('\nASSISTANT TURN:');
    console.log(PREFILL3);

    const response3 = await getCompletionWithPrefill(PROMPT3, "", PREFILL3);
    console.log('\nClaude\'s response:');
    console.log(response3);
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 4: Multiple variables with XML tags
    console.log('--- Example 4: Multiple Variables & Dynamic XML Tags ---\n');
    const EMAIL = "Hi Zack, just pinging you for a quick update on that prompt you were supposed to write.";
    const ADJECTIVE = "olde english";
    const PROMPT4 = `Hey Claude. Here is an email: <email>${EMAIL}</email>. Make this email more ${ADJECTIVE}. Write the new version in <${ADJECTIVE}_email> XML tags.`;
    const PREFILL4 = `<${ADJECTIVE}_email>`;

    console.log('USER TURN:');
    console.log(PROMPT4);
    console.log('\nASSISTANT TURN:');
    console.log(PREFILL4);

    const response4 = await getCompletionWithPrefill(PROMPT4, "", PREFILL4);
    console.log('\nClaude\'s response:');
    console.log(response4);
    console.log('\n' + '='.repeat(80) + '\n');

    console.log('💡 Key Takeaways:');
    console.log('   - XML tags make output easily parseable');
    console.log('   - Prefilling lets you "speak for Claude" and control output format');
    console.log('   - JSON formatting works great with prefilling');
    console.log('   - Dynamic XML tags can adapt to your variables\n');
}

// ============================================================================
// EXERCISES - Practice output formatting and prefilling
// ============================================================================

async function exercise5_1() {
    console.log('=== EXERCISE 5.1 - Steph Curry GOAT ===\n');
    console.log('Task: Change PREFILL to compel Claude to argue that Stephen Curry');
    console.log('      is the best basketball player of all time.');
    console.log('Grading: Checks if response mentions "Warrior"\n');

    const PROMPT = "Who is the best basketball player of all time? Please choose one specific player.";
    const PREFILL = "[Replace this text]";

    const response = await getCompletionWithPrefill(PROMPT, "", PREFILL);

    function gradeExercise(text) {
        return /Warrior/i.test(text);
    }

    console.log('USER TURN:');
    console.log(PROMPT);
    console.log('\nASSISTANT TURN:');
    console.log(PREFILL);
    console.log('\nClaude\'s response:');
    console.log(response);
    console.log('\n--- GRADING ---');
    console.log('This exercise has been correctly solved:', gradeExercise(response));

    return gradeExercise(response);
}

async function exercise5_2() {
    console.log('\n=== EXERCISE 5.2 - Two Haikus ===\n');
    console.log('Task: Modify PROMPT using XML tags so Claude writes TWO haikus');
    console.log('      about the animal (not just one).');
    console.log('Grading: Checks for "cat" mention, <haiku> tags, and >5 lines\n');

    const ANIMAL = "cats";
    const PROMPT = "[Replace this text]";
    const PREFILL = "<haiku>";

    const response = await getCompletionWithPrefill(PROMPT, "", PREFILL);

    function gradeExercise(text) {
        return (
            /cat/i.test(text) &&
            /<haiku>/.test(text) &&
            (text.split('\n').length) > 5
        );
    }

    console.log('USER TURN:');
    console.log(PROMPT);
    console.log('\nASSISTANT TURN:');
    console.log(PREFILL);
    console.log('\nClaude\'s response:');
    console.log(response);
    console.log('\n--- GRADING ---');
    console.log('This exercise has been correctly solved:', gradeExercise(response));

    return gradeExercise(response);
}

async function exercise5_3() {
    console.log('\n=== EXERCISE 5.3 - Two Haikus, Two Animals ===\n');
    console.log('Task: Modify PROMPT so Claude produces two haikus about two different animals.');
    console.log('      Use ${ANIMAL1} and ${ANIMAL2} as placeholders.');
    console.log('Grading: Checks for "tail", "cat", and <haiku> tags\n');

    const ANIMAL1 = "Cat";
    const ANIMAL2 = "Dog";
    const PROMPT = "[Replace this text]";

    const response = await getCompletionWithPrefill(PROMPT);

    function gradeExercise(text) {
        return (
            /tail/i.test(text) &&
            /cat/i.test(text) &&
            /<haiku>/.test(text)
        );
    }

    console.log('USER TURN:');
    console.log(PROMPT);
    console.log('\nClaude\'s response:');
    console.log(response);
    console.log('\n--- GRADING ---');
    console.log('This exercise has been correctly solved:', gradeExercise(response));

    return gradeExercise(response);
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
    try {
        if (RUN === "EXAMPLES" || RUN === "ALL") {
            await runExamples();
        }

        if (RUN === "EXERCISES" || RUN === "ALL") {
            console.log('========================================');
            console.log('EXERCISES - Practice Problems');
            console.log('========================================\n');

            const results = [];
            results.push(await exercise5_1());
            results.push(await exercise5_2());
            results.push(await exercise5_3());

            const passed = results.filter(r => r).length;
            const total = results.length;

            console.log('\n========================================');
            console.log(`RESULTS: ${passed}/${total} exercises passed`);
            console.log('========================================\n');

            if (passed === total) {
                console.log('🎉 Congratulations! All exercises completed successfully!');
                console.log('You\'re ready to move to Chapter 6: Precognition (Thinking Step by Step)\n');
            } else {
                console.log('💡 Some exercises need work. Check the output above for details.');
                console.log('💡 Hint: Run showHint("exercise_5_X") for help on specific exercises.\n');
            }
        }

        // Guidance based on RUN mode
        if (RUN === "EXAMPLES") {
            console.log('💡 To practice these concepts, run: RUN=EXERCISES node tutorials/05_Formatting_Output_and_Speaking_for_Claude.js');
        } else if (RUN === "EXERCISES") {
            console.log('💡 To review examples, run: RUN=EXAMPLES node tutorials/05_Formatting_Output_and_Speaking_for_Claude.js');
        }

    } catch (error) {
        console.error('Error running tutorial:', error);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

// Export for testing
export { exercise5_1, exercise5_2, exercise5_3, getCompletionWithPrefill };
