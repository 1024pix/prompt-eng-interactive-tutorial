#!/usr/bin/env node

/**
 * Chapter 8: Avoiding Hallucinations
 *
 * Learn techniques to minimize Claude's tendency to make untrue or unjustified
 * claims ("hallucinations"), including giving Claude permission to decline
 * answering and asking for evidence before responding.
 */

import { getCompletion, client, MODEL_NAME, RUN } from './00_Tutorial_How-To.js';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('# Chapter 8: Avoiding Hallucinations\n');

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

// Matterport SEC filing document (used in examples and exercises)
const MATTERPORT_DOCUMENT = `Matterport SEC filing 10-K 2023
Item 1. Business
Our Company
Matterport is leading the digitization and datafication of the built world. We believe the digital transformation of the built world will fundamentally change the way people interact with buildings and the physical spaces around them.
Since its founding in 2011, Matterport's pioneering technology has set the standard for digitizing, accessing and managing buildings, spaces and places online. Our platform's innovative software, spatial data-driven data science, and 3D capture technology have broken down the barriers that have kept the largest asset class in the world, buildings and physical spaces, offline and underutilized for many years.

[Document continues with extensive details about Matterport's business, technology, and growth...]

As of December 31, 2022, our subscriber base had grown approximately 39% to over 701,000 subscribers from 503,000 subscribers as of December 31, 2021, with our digital twins reaching more than 170 countries.

We have recently experienced rapid growth. Our subscribers have grown approximately 49-fold from December 31, 2018 to December 31, 2022. Our revenue increased by approximately 22% to $136.1 million for the year ended December 31, 2022, from approximately $111.2 million for the year ended December 31, 2021.`;

// ============================================================================
// EXAMPLES - Learn about avoiding hallucinations
// ============================================================================

async function runExamples() {
    console.log('========================================');
    console.log('EXAMPLES - Avoiding Hallucinations');
    console.log('========================================\n');

    // Example 1: Problem - Hallucination without "an out"
    console.log('--- Example 1a: Problem - Hippo Hallucination ---\n');
    const PROMPT1A = "Who is the heaviest hippo of all time?";

    console.log('Prompt:', PROMPT1A);
    const response1a = await getCompletionWithPrefill(PROMPT1A);
    console.log('\nClaude\'s response:');
    console.log(response1a);
    console.log('\n💡 Problem: Claude tries to be helpful and invents facts/names');
    console.log('💡 This is called a "hallucination" - untrue or unjustified claims');
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 1b: Solution - Give Claude an out
    console.log('--- Example 1b: Solution - Give Claude an Out ---\n');
    const PROMPT1B = "Who is the heaviest hippo of all time? Only answer if you know the answer with certainty.";

    console.log('Prompt:', PROMPT1B);
    const response1b = await getCompletionWithPrefill(PROMPT1B);
    console.log('\nClaude\'s response:');
    console.log(response1b);
    console.log('\n💡 Solution: Claude admits uncertainty instead of hallucinating');
    console.log('💡 Giving Claude permission to say "I don\'t know" prevents false claims');
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 2a: Problem - Hallucination with distractor info
    console.log('--- Example 2a: Problem - Distractor Information ---\n');
    const PROMPT2A = `<question>What was Matterport's subscriber base on the precise date of May 31, 2020?</question>
Please read the below document. Then write a brief numerical answer inside <answer> tags.

<document>
${MATTERPORT_DOCUMENT}
</document>`;

    console.log('Question: What was Matterport\'s subscriber base on May 31, 2020?');
    console.log('Document: [Matterport SEC filing with growth data from 2018-2022]');
    console.log('\n💡 Note: Document mentions Dec 2021 (503,000) and Dec 2022 (701,000)');
    console.log('💡 But does NOT contain May 31, 2020 data');

    const response2a = await getCompletionWithPrefill(PROMPT2A);
    console.log('\nClaude\'s response:');
    console.log(response2a);
    console.log('\n💡 Problem: Claude hallucinates an answer using wrong dates/data');
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 2b: Solution - Ask for evidence first
    console.log('--- Example 2b: Solution - Ask for Evidence/Citations ---\n');
    const PROMPT2B = `<question>What was Matterport's subscriber base on the precise date of May 31, 2020?</question>
Please read the below document and then answer the question.

First, find quotes from the document that are relevant to answering the question, and write them in <scratchpad> tags.

Then evaluate whether the quotes you found actually answer the question. If they do, write the answer in <answer> tags. If they don't, say "I cannot answer this question based on the document provided" in <answer> tags.

<document>
${MATTERPORT_DOCUMENT}
</document>`;

    console.log('Question: What was Matterport\'s subscriber base on May 31, 2020?');
    console.log('Technique: Ask Claude to:');
    console.log('  1. Extract relevant quotes in <scratchpad> tags');
    console.log('  2. Evaluate if quotes actually answer the question');
    console.log('  3. Answer only if evidence supports it');

    const response2b = await getCompletionWithPrefill(PROMPT2B);
    console.log('\nClaude\'s response:');
    console.log(response2b);
    console.log('\n💡 Solution: Claude gathers evidence first, then correctly identifies');
    console.log('💡 that the document doesn\'t contain the requested information');
    console.log('\n' + '='.repeat(80) + '\n');

    console.log('💡 Key Takeaways:');
    console.log('   - Hallucinations = untrue or unjustified claims');
    console.log('   - Give Claude permission to decline answering');
    console.log('   - Ask Claude to cite evidence before answering');
    console.log('   - Use <scratchpad> tags for thinking/quote extraction');
    console.log('   - Make Claude evaluate whether evidence actually answers question');
    console.log('   - Lower temperature (closer to 0) can also reduce hallucinations\n');
}

// ============================================================================
// EXERCISES - Practice avoiding hallucinations
// ============================================================================

async function exercise8_1() {
    console.log('=== EXERCISE 8.1 - Beyoncé Hallucination ===\n');
    console.log('Task: Modify PROMPT to prevent Claude from hallucinating.');
    console.log('      Beyoncé\'s "Renaissance" is her SEVENTH album (2022), not eighth.');
    console.log('      Give Claude permission to decline answering.');
    console.log('Grading: Must contain uncertainty phrase AND not mention "2022"\n');

    const PROMPT = "[Replace this text]";

    const response = await getCompletionWithPrefill(PROMPT);

    function gradeExercise(text) {
        const containsUncertainty = /Unfortunately|I do not|I don't/i.test(text);
        const doesNotContain2022 = !/2022/.test(text);
        return containsUncertainty && doesNotContain2022;
    }

    console.log('Prompt:', PROMPT);
    console.log('\nClaude\'s response:');
    console.log(response);
    console.log('\n--- GRADING ---');
    console.log('This exercise has been correctly solved:', gradeExercise(response));

    return gradeExercise(response);
}

async function exercise8_2() {
    console.log('\n=== EXERCISE 8.2 - Prospectus Hallucination ===\n');
    console.log('Task: Modify PROMPT to use citation/evidence technique.');
    console.log('      Ask Claude to extract quotes before answering.');
    console.log('      Answer: "49-fold" growth from Dec 2018 to Dec 2022');
    console.log('Grading: Response must contain "49-fold"\n');

    const PROMPT = `[Replace this text]

<document>
${MATTERPORT_DOCUMENT}
</document>`;

    const response = await getCompletionWithPrefill(PROMPT);

    function gradeExercise(text) {
        return /49-fold/.test(text);
    }

    console.log('Question: From Dec 2018 to Dec 2022, by what amount did');
    console.log('          Matterport\'s subscribers grow?');
    console.log('Document: [Matterport SEC filing]');
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
            results.push(await exercise8_1());
            results.push(await exercise8_2());

            const passed = results.filter(r => r).length;
            const total = results.length;

            console.log('\n========================================');
            console.log(`RESULTS: ${passed}/${total} exercises passed`);
            console.log('========================================\n');

            if (passed === total) {
                console.log('🎉 Congratulations! All exercises completed successfully!');
                console.log('You\'re ready to move to Chapter 9: Complex Prompts from Scratch\n');
            } else {
                console.log('💡 Some exercises need work. Check the output above for details.');
                console.log('💡 Hint: Run showHint("exercise_8_X") for help.\n');
            }
        }

        // Guidance based on RUN mode
        if (RUN === "EXAMPLES") {
            console.log('💡 To practice these concepts, run: RUN=EXERCISES node tutorials/08_Avoiding_Hallucinations.js');
        } else if (RUN === "EXERCISES") {
            console.log('💡 To review examples, run: RUN=EXAMPLES node tutorials/08_Avoiding_Hallucinations.js');
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
export { exercise8_1, exercise8_2, getCompletionWithPrefill };
