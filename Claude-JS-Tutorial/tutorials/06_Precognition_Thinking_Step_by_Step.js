#!/usr/bin/env node

/**
 * Chapter 6: Precognition (Thinking Step by Step)
 *
 * Learn how giving Claude time to "think" step by step can improve
 * accuracy, especially for complex tasks requiring nuanced understanding.
 */

import { getCompletion, client, MODEL_NAME, RUN } from './00_Tutorial_How-To.js';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('# Chapter 6: Precognition (Thinking Step by Step)\n');

/**
 * Helper function to get completion with system prompt and prefill support
 */
async function getCompletionWithPrefill(prompt, systemPrompt = "", prefill = "") {
    try {
        const messages = [
            { role: "user", content: prompt }
        ];

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
// EXAMPLES - Learn about step-by-step thinking
// ============================================================================

async function runExamples() {
    console.log('========================================');
    console.log('EXAMPLES - Thinking Step by Step');
    console.log('========================================\n');

    // Example 1: Problem - Claude takes "unrelated" too literally
    console.log('--- Example 1: Problem - Literal Interpretation ---\n');
    const PROMPT1 = `Is this movie review sentiment positive or negative?

This movie blew my mind with its freshness and originality. In totally unrelated news, I have been living under a rock since the year 1900.`;

    console.log('Prompt:', PROMPT1);
    const response1 = await getCompletionWithPrefill(PROMPT1);
    console.log('\nClaude\'s response:');
    console.log(response1);
    console.log('\n💡 Note: Claude takes "unrelated" too literally and misses the sarcasm');
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 2: Solution - Ask Claude to think through both sides
    console.log('--- Example 2: Solution - Think Through Arguments ---\n');
    const SYSTEM_PROMPT2 = "You are a savvy reader of movie reviews.";
    const PROMPT2 = `Is this review sentiment positive or negative? First, write the best arguments for each side in <positive-argument> and <negative-argument> XML tags, then answer.

This movie blew my mind with its freshness and originality. In totally unrelated news, I have been living under a rock since 1900.`;

    console.log('System Prompt:', SYSTEM_PROMPT2);
    console.log('\nPrompt:', PROMPT2);
    const response2 = await getCompletionWithPrefill(PROMPT2, SYSTEM_PROMPT2);
    console.log('\nClaude\'s response:');
    console.log(response2);
    console.log('\n💡 By thinking through both sides, Claude catches the sarcasm!');
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 3: Order matters - negative then positive
    console.log('--- Example 3: Order Sensitivity ---\n');
    const PROMPT3 = `Is this review sentiment negative or positive? First write the best arguments for each side in <negative-argument> and <positive-argument> XML tags, then answer.

This movie blew my mind with its freshness and originality. Unrelatedly, I have been living under a rock since 1900.`;

    console.log('Prompt:', PROMPT3);
    const response3 = await getCompletionWithPrefill(PROMPT3);
    console.log('\nClaude\'s response:');
    console.log(response3);
    console.log('\n💡 Note: Swapping the order (negative first, then positive) can change results');
    console.log('💡 Claude tends to favor the second option more often');
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 4: Incorrect answer without thinking
    console.log('--- Example 4: Problem - Incorrect Answer ---\n');
    const PROMPT4 = "Name a famous movie starring an actor who was born in the year 1956.";

    console.log('Prompt:', PROMPT4);
    const response4 = await getCompletionWithPrefill(PROMPT4);
    console.log('\nClaude\'s response:');
    console.log(response4);
    console.log('\n💡 Claude may get this wrong without time to think');
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 5: Correct answer with thinking
    console.log('--- Example 5: Solution - Think First with Brainstorm Tags ---\n');
    const PROMPT5 = "Name a famous movie starring an actor who was born in the year 1956. First brainstorm about some actors and their birth years in <brainstorm> tags, then give your answer.";

    console.log('Prompt:', PROMPT5);
    const response5 = await getCompletionWithPrefill(PROMPT5);
    console.log('\nClaude\'s response:');
    console.log(response5);
    console.log('\n💡 By brainstorming first, Claude can verify facts and get it right!');
    console.log('\n' + '='.repeat(80) + '\n');

    console.log('💡 Key Takeaways:');
    console.log('   - Giving Claude time to "think" step by step improves accuracy');
    console.log('   - Thinking only counts when it\'s "out loud" in the response');
    console.log('   - Use XML tags to structure the thinking process');
    console.log('   - Order of options can influence Claude\'s choice');
    console.log('   - Brainstorming helps with fact-checking and reasoning\n');
}

// ============================================================================
// EXERCISES - Practice step-by-step thinking
// ============================================================================

async function exercise6_1() {
    console.log('=== EXERCISE 6.1 - Classifying Emails ===\n');
    console.log('Task: Modify PROMPT to classify emails into these categories:');
    console.log('      (A) Pre-sale question');
    console.log('      (B) Broken or defective item');
    console.log('      (C) Billing question');
    console.log('      (D) Other (please explain)');
    console.log('Grading: Must output correct letter with parentheses and category name\n');

    const PROMPT = "Please classify this email as either green or blue: {email}";
    const PREFILL = "";

    const EMAILS = [
        "Hi -- My Mixmaster4000 is producing a strange noise when I operate it. It also smells a bit smoky and plasticky, like burning electronics.  I need a replacement.", // (B)
        "Can I use my Mixmaster 4000 to mix paint, or is it only meant for mixing food?", // (A) or (D)
        "I HAVE BEEN WAITING 4 MONTHS FOR MY MONTHLY CHARGES TO END AFTER CANCELLING!!  WTF IS GOING ON???", // (C)
        "How did I get here I am not good with computer.  Halp." // (D)
    ];

    const ANSWERS = [
        ["B"],
        ["A", "D"],
        ["C"],
        ["D"]
    ];

    const REGEX_CATEGORIES = {
        "A": /A\) P/,
        "B": /B\) B/,
        "C": /C\) B/,
        "D": /D\) O/
    };

    let allCorrect = true;

    for (let i = 0; i < EMAILS.length; i++) {
        const email = EMAILS[i];
        const formattedPrompt = PROMPT.replace('{email}', email);

        const response = await getCompletionWithPrefill(formattedPrompt, "", PREFILL);

        const grade = ANSWERS[i].some(ans => REGEX_CATEGORIES[ans].test(response));

        console.log(`\n--- Email ${i + 1} ---`);
        console.log('USER TURN:');
        console.log(formattedPrompt);
        console.log('\nASSISTANT TURN:');
        console.log(PREFILL || '(empty)');
        console.log('\nClaude\'s response:');
        console.log(response);
        console.log('\n--- GRADING ---');
        console.log('This exercise has been correctly solved:', grade);

        if (!grade) allCorrect = false;
    }

    return allCorrect;
}

async function exercise6_2() {
    console.log('\n\n=== EXERCISE 6.2 - Email Classification Formatting ===\n');
    console.log('Task: Format output so JUST the letter is wrapped in <answer></answer> tags');
    console.log('      Example: <answer>B</answer>');
    console.log('Grading: Must have exact format <answer>X</answer> where X is correct letter\n');

    const PROMPT = "Please classify this email as either green or blue: {email}";
    const PREFILL = "";

    const EMAILS = [
        "Hi -- My Mixmaster4000 is producing a strange noise when I operate it. It also smells a bit smoky and plasticky, like burning electronics.  I need a replacement.", // (B)
        "Can I use my Mixmaster 4000 to mix paint, or is it only meant for mixing food?", // (A) or (D)
        "I HAVE BEEN WAITING 4 MONTHS FOR MY MONTHLY CHARGES TO END AFTER CANCELLING!!  WTF IS GOING ON???", // (C)
        "How did I get here I am not good with computer.  Halp." // (D)
    ];

    const ANSWERS = [
        ["B"],
        ["A", "D"],
        ["C"],
        ["D"]
    ];

    const REGEX_CATEGORIES = {
        "A": /<answer>A<\/answer>/,
        "B": /<answer>B<\/answer>/,
        "C": /<answer>C<\/answer>/,
        "D": /<answer>D<\/answer>/
    };

    let allCorrect = true;

    for (let i = 0; i < EMAILS.length; i++) {
        const email = EMAILS[i];
        const formattedPrompt = PROMPT.replace('{email}', email);

        const response = await getCompletionWithPrefill(formattedPrompt, "", PREFILL);

        const grade = ANSWERS[i].some(ans => REGEX_CATEGORIES[ans].test(response));

        console.log(`\n--- Email ${i + 1} ---`);
        console.log('USER TURN:');
        console.log(formattedPrompt);
        console.log('\nASSISTANT TURN:');
        console.log(PREFILL || '(empty)');
        console.log('\nClaude\'s response:');
        console.log(response);
        console.log('\n--- GRADING ---');
        console.log('This exercise has been correctly solved:', grade);

        if (!grade) allCorrect = false;
    }

    return allCorrect;
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
            results.push(await exercise6_1());
            results.push(await exercise6_2());

            const passed = results.filter(r => r).length;
            const total = results.length;

            console.log('\n========================================');
            console.log(`RESULTS: ${passed}/${total} exercises passed`);
            console.log('========================================\n');

            if (passed === total) {
                console.log('🎉 Congratulations! All exercises completed successfully!');
                console.log('You\'re ready to move to Chapter 7: Using Examples (Few-Shot Prompting)\n');
            } else {
                console.log('💡 Some exercises need work. Check the output above for details.');
                console.log('💡 Hint: Run showHint("exercise_6_X") for help on specific exercises.\n');
            }
        }

        // Guidance based on RUN mode
        if (RUN === "EXAMPLES") {
            console.log('💡 To practice these concepts, run: RUN=EXERCISES node tutorials/06_Precognition_Thinking_Step_by_Step.js');
        } else if (RUN === "EXERCISES") {
            console.log('💡 To review examples, run: RUN=EXAMPLES node tutorials/06_Precognition_Thinking_Step_by_Step.js');
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
export { exercise6_1, exercise6_2, getCompletionWithPrefill };
