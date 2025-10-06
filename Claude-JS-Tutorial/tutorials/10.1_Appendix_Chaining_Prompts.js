#!/usr/bin/env node

/**
 * Appendix 10.1: Chaining Prompts
 *
 * Learn how to use Claude's responses from one API call as input to subsequent calls.
 * Demonstrates progressive refinement, self-correction, and response improvement
 * through multi-turn conversations.
 */

import { getCompletion, client, MODEL_NAME, RUN } from './00_Tutorial_How-To.js';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('# Appendix 10.1: Chaining Prompts\n');

/**
 * Helper function for multi-turn conversations
 * Takes an array of messages instead of a single prompt
 */
async function getCompletionMessages(messages, systemPrompt = "") {
    try {
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
// EXAMPLES - Learn about prompt chaining
// ============================================================================

async function runExamples() {
    console.log('========================================');
    console.log('EXAMPLES - Prompt Chaining');
    console.log('========================================\n');

    console.log('💡 Prompt Chaining Concept:');
    console.log('   - Use Claude\'s response from one call as input to the next');
    console.log('   - Build multi-turn conversations for progressive refinement');
    console.log('   - Claude can review and improve its own work');
    console.log('   - Foundation for function calling and tool use\n');
    console.log('='.repeat(80) + '\n');

    // Example 1: Word List Error Correction
    console.log('--- Example 1: Word List Error Correction ---\n');

    const firstUser1 = "Please give me a list of 10 words that end with the letters 'ab'. Your response should be only the 10 words, with each word on its own line.";

    const firstResponse1 = await getCompletionMessages([
        { role: "user", content: firstUser1 }
    ]);

    console.log('First request: "Give me 10 words ending in \'ab\'"');
    console.log('\nClaude\'s first response:');
    console.log(firstResponse1);

    // Chain second request
    const secondUser1 = "From the list you just gave me, please remove any words that are not real English words. Give your response as a list with each word on a new line.";

    const messages1 = [
        { role: "user", content: firstUser1 },
        { role: "assistant", content: firstResponse1 },
        { role: "user", content: secondUser1 }
    ];

    const secondResponse1 = await getCompletionMessages(messages1);

    console.log('\nSecond request: "Remove non-real words"');
    console.log('\nClaude\'s corrected response:');
    console.log(secondResponse1);
    console.log('\n💡 Claude successfully identified and removed fake words!');
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 2: Preventing Overcorrection
    console.log('--- Example 2: Preventing Overcorrection ---\n');

    const prefill2 = "1. cab\n2. dab\n3. grab\n4. lab\n5. nab\n6. scab\n7. slab\n8. stab\n9. tab\n10. crab";

    const secondUser2 = "From the list you just gave me, please remove any words that are not real English words.";

    const messages2 = [
        { role: "user", content: firstUser1 },
        { role: "assistant", content: prefill2 },
        { role: "user", content: secondUser2 }
    ];

    const secondResponse2 = await getCompletionMessages(messages2);

    console.log('Pre-filled with ALL correct words:');
    console.log(prefill2);
    console.log('\nSecond request: "Remove non-real words"');
    console.log('\nClaude\'s response:');
    console.log(secondResponse2);
    console.log('\n💡 Problem: Claude sometimes changes correct answers unnecessarily');
    console.log('💡 Solution: Give Claude an "out" (permission to say nothing needs changing)');
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 3: Giving Claude an Out
    console.log('--- Example 3: Giving Claude an Out ---\n');

    const secondUser3 = "From the list you just gave me, please remove any words that are not real English words. If all words are real English words, return the original list.";

    const messages3 = [
        { role: "user", content: firstUser1 },
        { role: "assistant", content: prefill2 },
        { role: "user", content: secondUser3 }
    ];

    const secondResponse3 = await getCompletionMessages(messages3);

    console.log('Pre-filled with ALL correct words:');
    console.log(prefill2);
    console.log('\nSecond request: "Remove non-real words. If all are real, return original list"');
    console.log('\nClaude\'s response:');
    console.log(secondResponse3);
    console.log('\n💡 Success! Claude maintains confidence when already correct');
    console.log('💡 Reinforces Chapter 8 concept: give Claude permission to say "no changes needed"');
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 4: Story Improvement
    console.log('--- Example 4: Story Improvement ---\n');

    const firstUser4 = "Please write a 3-sentence story about a girl who likes to run.";

    const firstResponse4 = await getCompletionMessages([
        { role: "user", content: firstUser4 }
    ]);

    console.log('First request: "Write a 3-sentence story about a girl who likes to run"');
    console.log('\nClaude\'s first story:');
    console.log(firstResponse4);

    const secondUser4 = "Make the story better.";

    const messages4 = [
        { role: "user", content: firstUser4 },
        { role: "assistant", content: firstResponse4 },
        { role: "user", content: secondUser4 }
    ];

    const secondResponse4 = await getCompletionMessages(messages4);

    console.log('\nSecond request: "Make the story better"');
    console.log('\nClaude\'s improved story:');
    console.log(secondResponse4);
    console.log('\n💡 Demonstrates creative improvement through chaining');
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 5: Name Extraction and Processing
    console.log('--- Example 5: Name Extraction and Processing (Function-like Chaining) ---\n');

    const dialogue = `Alice: "Hi Bob, how are you?"
Bob: "I'm good, thanks Alice! Have you seen Charlie today?"
Alice: "Yes, I ran into Charlie and Dana at the cafe."
Bob: "Oh great! I need to talk to Dana about the project."`;

    const firstUser5 = `Please extract all the names from this dialogue and list them:

${dialogue}

Put the names in <names> tags.`;

    const prefill5 = "<names>";

    const firstMessages5 = [
        { role: "user", content: firstUser5 },
        { role: "assistant", content: prefill5 }
    ];

    const firstResponse5 = await getCompletionMessages(firstMessages5);

    console.log('Step 1 - Extract names from dialogue:');
    console.log('\nClaude\'s extracted names:');
    console.log(prefill5 + firstResponse5);

    const secondUser5 = "Please alphabetize the list of names you just gave me.";

    const messages5 = [
        { role: "user", content: firstUser5 },
        { role: "assistant", content: prefill5 + "\n" + firstResponse5 },
        { role: "user", content: secondUser5 }
    ];

    const secondResponse5 = await getCompletionMessages(messages5);

    console.log('\nStep 2 - Alphabetize the names:');
    console.log('\nClaude\'s alphabetized list:');
    console.log(secondResponse5);
    console.log('\n💡 Shows function-calling-like behavior: extraction → processing');
    console.log('💡 Foundation for Appendix 10.2 (Tool Use)');
    console.log('\n' + '='.repeat(80) + '\n');

    console.log('💡 Key Takeaways:');
    console.log('   - Prompt chaining enables multi-step workflows');
    console.log('   - Claude can review and improve its own responses');
    console.log('   - Give Claude an "out" to prevent unnecessary changes');
    console.log('   - Combine with prefilling for precise control');
    console.log('   - Foundation for complex agentic behaviors');
    console.log('   - See Appendix 10.2 for advanced tool use patterns\n');
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
    try {
        if (RUN === "EXAMPLES" || RUN === "ALL") {
            await runExamples();
        }

        console.log('📚 This appendix has no exercises - it\'s a demonstration chapter.');
        console.log('🔗 Next: Explore Appendix 10.2 for Tool Use (function calling) patterns\n');

        // Guidance based on RUN mode
        if (RUN === "EXAMPLES") {
            console.log('💡 To explore tool use, run: node tutorials/10.2_Appendix_Tool_Use.js');
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
export { getCompletionMessages };
