#!/usr/bin/env node

/**
 * Chapter 9: Complex Prompts from Scratch
 *
 * The capstone chapter! Learn how to combine all previous techniques
 * into a structured framework for creating complex, production-ready prompts.
 * Introduces a 10-element prompt structure that can be mixed and matched
 * based on your specific use case.
 */

import { getCompletion, client, MODEL_NAME, RUN } from './00_Tutorial_How-To.js';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('# Chapter 9: Complex Prompts from Scratch\n');

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
// THE 10-ELEMENT PROMPT STRUCTURE FRAMEWORK
// ============================================================================

const FRAMEWORK_INFO = `
📋 THE 10-ELEMENT PROMPT STRUCTURE

A flexible framework for complex prompts. Not all elements needed for every task!

1. 🎭 User role - Always starts with user role in Messages API
2. 🎯 Task context - Define role/goals for Claude (early in prompt)
3. 🎨 Tone context - Specify desired tone (optional)
4. 📝 Detailed task description and rules - Expand on tasks, include "out" clause
5. 💡 Examples - Most effective tool, use XML tags (more = better)
6. 📊 Input data to process - Data in XML tags (flexible ordering)
7. ⚡ Immediate task description - Remind Claude of task (near end)
8. 🧠 Precognition - Think step by step (near end, after immediate task)
9. 📋 Output formatting - Specify format (toward end)
10. 🚀 Prefilling Claude's response - Steer behavior (in assistant role)

💡 Key Principles:
   - Start comprehensive, then refine
   - Ordering matters for some elements, not others
   - Mix and match based on your needs
   - Examples are your most powerful tool
`;

// ============================================================================
// EXAMPLES - Learn the 10-element framework
// ============================================================================

async function runExamples() {
    console.log('========================================');
    console.log('EXAMPLES - Complex Prompt Assembly');
    console.log('========================================\n');

    console.log(FRAMEWORK_INFO);
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 1: Career Coach Chatbot (all 10 elements)
    console.log('--- Example 1: Career Coach Chatbot (All 10 Elements) ---\n');

    const HISTORY1 = "";  // Could be conversation history
    const QUESTION1 = "How do I get better at communicating over email?";

    // Building prompt with all 10 elements
    let PROMPT1 = "";

    // Element 2: Task context (role/goals)
    const TASK_CONTEXT1 = "You are an AI career coach named Joe created by the company AdAstra Careers. Your goal is to give career advice to users.";
    PROMPT1 += TASK_CONTEXT1;

    // Element 3: Tone context
    const TONE_CONTEXT1 = "You respond in a friendly and supportive tone.";
    PROMPT1 += "\n\n" + TONE_CONTEXT1;

    // Element 4: Detailed task description and rules
    const TASK_DESCRIPTION1 = `You should always respond to the user in a way that is appropriate given the conversation history. You should start your response with a warm greeting like "Hey there" or "Hi".
If the user asks a question that is not about career advice, you should politely decline to answer and steer the conversation back to career advice.
If the user asks you to do something that is not related to career advice, you should politely decline and steer the conversation back to career advice.`;
    PROMPT1 += "\n\n" + TASK_DESCRIPTION1;

    // Element 5: Examples
    const EXAMPLES1 = `Here is an example of how you should respond:
<example>
User: Hi, how's it going?
Joe: <response>Hey there! I'm doing great, thanks for asking. I'm here to help you with any career advice you need. What's on your mind?</response>
</example>`;
    PROMPT1 += "\n\n" + EXAMPLES1;

    // Element 6: Input data (conversation history)
    if (HISTORY1) {
        PROMPT1 += `\n\n<conversation_history>\n${HISTORY1}\n</conversation_history>`;
    }

    // Element 7: Immediate task description
    const IMMEDIATE_TASK1 = `Now, here is the user's question:
<user_query>${QUESTION1}</user_query>`;
    PROMPT1 += "\n\n" + IMMEDIATE_TASK1;

    // Element 8: Precognition (think step by step)
    const PRECOGNITION1 = "How do you respond to the user? Before answering, think step by step about whether the user's question is related to career advice.";
    PROMPT1 += "\n\n" + PRECOGNITION1;

    // Element 9: Output formatting
    const OUTPUT_FORMAT1 = "Put your response in <response></response> tags.";
    PROMPT1 += " " + OUTPUT_FORMAT1;

    // Element 10: Prefill
    const PREFILL1 = "[Joe]";

    console.log('Question:', QUESTION1);
    console.log('\n💡 Prompt uses all 10 elements:');
    console.log('   - Task context: AI career coach named Joe');
    console.log('   - Tone: Friendly and supportive');
    console.log('   - Rules: Stay in character, redirect off-topic');
    console.log('   - Example: How Joe greets and responds');
    console.log('   - Immediate task: User question');
    console.log('   - Precognition: Think if question is career-related');
    console.log('   - Output: <response> tags');
    console.log('   - Prefill: [Joe] to maintain character');

    const response1 = await getCompletionWithPrefill(PROMPT1, "", PREFILL1);
    console.log('\nClaude\'s response:');
    console.log(PREFILL1 + response1);
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 2: Legal Services (different ordering)
    console.log('--- Example 2: Legal Services (Flexible Ordering) ---\n');

    const LEGAL_RESEARCH = `<search_results>
<search_result id="1">
Title: Contract Law Basics
Content: A valid contract requires offer, acceptance, and consideration. Consideration must be something of value exchanged between parties.
</search_result>
<search_result id="2">
Title: Breach of Contract Remedies
Content: When a contract is breached, remedies may include damages, specific performance, or rescission. Damages aim to put the non-breaching party in the position they would have been in had the contract been performed.
</search_result>
<search_result id="3">
Title: Statute of Frauds
Content: Certain contracts must be in writing to be enforceable, including contracts for the sale of land and contracts that cannot be performed within one year.
</search_result>
</search_results>`;

    const QUESTION2 = "What remedies are available for breach of contract?";

    let PROMPT2 = "";

    // Different order: Start with role
    PROMPT2 += "You are an expert lawyer with deep knowledge of contract law.";

    // Then examples (showing citation format)
    PROMPT2 += `\n\nHere's an example of how to cite sources:
<example>
Question: What is consideration?
Answer: Consideration is something of value exchanged between parties in a contract [1]. It is a required element for a valid contract [1].
</example>`;

    // Then input data
    PROMPT2 += `\n\nHere are the search results:\n${LEGAL_RESEARCH}`;

    // Then task description
    PROMPT2 += `\n\nYour task is to answer the user's question using the search results. Write a 2-paragraph answer. If the search results don't contain enough information, say "I don't have enough information to answer this question."`;

    // Precognition: Extract quotes first
    PROMPT2 += `\n\nFirst, pull out the most relevant quotes from the search results in <relevant_quotes> tags. Then write your answer in <answer> tags, citing sources using bracket notation like [1].`;

    // The question
    PROMPT2 += `\n\nQuestion: ${QUESTION2}`;

    // Prefill to force quote extraction
    const PREFILL2 = "<relevant_quotes>";

    console.log('Question:', QUESTION2);
    console.log('\n💡 Different element ordering:');
    console.log('   - Role → Examples → Data → Task → Precognition → Question');
    console.log('   - Shows flexibility in structure');
    console.log('   - Prefill forces quote extraction first');

    const response2 = await getCompletionWithPrefill(PROMPT2, "", PREFILL2);
    console.log('\nClaude\'s response:');
    console.log(PREFILL2 + response2);
    console.log('\n' + '='.repeat(80) + '\n');

    console.log('💡 Key Takeaways:');
    console.log('   - Use the 10-element framework as a starting point');
    console.log('   - Not all elements needed for every task');
    console.log('   - Ordering can be flexible based on task needs');
    console.log('   - Examples are your most powerful tool');
    console.log('   - Start comprehensive, then refine and simplify');
    console.log('   - Combine techniques from all previous chapters\n');
}

// ============================================================================
// EXERCISES - Apply the framework to real use cases
// ============================================================================

async function exercise9_1() {
    console.log('=== EXERCISE 9.1 - Financial Services Chatbot ===\n');
    console.log('Task: Create a tax accountant prompt using the 10-element framework.');
    console.log('      Use the tax code document to answer tax questions.');
    console.log('      Should extract quotes first, then answer.');
    console.log('Grading: Must identify correct answer and use proper structure\n');

    const QUESTION = "How long do I have to make an 83b election?";

    // Simplified tax code excerpt (key section)
    const TAX_CODE = `Internal Revenue Code Section 83 - Property transferred in connection with performance of services

(a) General rule - If, in connection with the performance of services, property is transferred to any person other than the person for whom such services are performed, the excess of the fair market value of such property over the amount paid for such property shall be included in the gross income of the person who performed such services...

(b) Election to include in gross income in year of transfer
  (1) In general - Any person who performs services in connection with which property is transferred may elect to include in his gross income for the taxable year in which such property is transferred, the excess of the fair market value of such property over the amount paid for such property.

  (2) Time for making election - An election under paragraph (1) with respect to any transfer of property shall be made not later than 30 days after the date of such transfer and in such manner as the Secretary provides in regulations...`;

    // Solution using the framework
    let PROMPT = "";

    // Task context
    PROMPT += "You are a master tax accountant with deep expertise in the Internal Revenue Code.";

    // Input data
    PROMPT += `\n\n<docs>${TAX_CODE}</docs>`;

    // Example
    PROMPT += `\n\n<example>
Question: What is Section 83 about?
Answer: <quotes>Section 83 deals with "Property transferred in connection with performance of services"</quotes>
<answer>Section 83 of the Internal Revenue Code addresses the tax treatment of property transferred in connection with the performance of services. It establishes rules for when and how such property transfers are included in gross income.</answer>
</example>`;

    // Task instructions
    PROMPT += `\n\nYour task is to answer tax questions based on the provided tax code documents. First, gather relevant quotes from the documents in <quotes> tags. Then provide a clear answer in <answer> tags.`;

    // Safety clause
    PROMPT += `\n\nOnly answer if the quotes clearly support your answer. If there is insufficient information, say "I don't have enough information to answer this question based on the provided documents."`;

    // The question
    PROMPT += `\n\nQuestion: ${QUESTION}`;

    const response = await getCompletionWithPrefill(PROMPT);

    function gradeExercise(text) {
        // Check for 30 days answer and proper structure
        return /30 days/i.test(text) && /<quotes>/i.test(text);
    }

    console.log('Question:', QUESTION);
    console.log('\nClaude\'s response:');
    console.log(response);
    console.log('\n--- GRADING ---');
    console.log('This exercise has been correctly solved:', gradeExercise(response));

    return gradeExercise(response);
}

async function exercise9_2() {
    console.log('\n=== EXERCISE 9.2 - Codebot (Socratic Teaching) ===\n');
    console.log('Task: Create a coding assistant that guides users Socratically.');
    console.log('      Should identify issues but not give direct answers.');
    console.log('Grading: Must identify bug and use Socratic teaching approach\n');

    const CODE = `def print_multiplicative_inverses(x, n):
    for i in range(n):
        print(x / i)`;

    // Solution using the framework
    let PROMPT = "";

    // Task context
    PROMPT += "You are Codebot, a helpful AI assistant who helps users debug their code. Your specialty is finding issues and bugs in code.";

    // Tone context
    PROMPT += "\n\nYou should act as a Socratic tutor who helps the user learn by asking questions and giving hints, rather than providing direct answers.";

    // Task description
    PROMPT += `\n\nYour process:
1. Carefully read the code
2. Identify any issues or bugs
3. List each issue in <issue> tags
4. Provide a friendly response that guides the user toward the solution without giving it away directly`;

    // Example
    PROMPT += `\n\n<example>
Code: def calculate_circle_area(r): return 3.14 * r
Response:
<issue>The formula for circle area is incomplete - it should use r squared, not just r</issue>
<response>I notice your area calculation might not be quite right. Remember, the area of a circle involves the radius in a specific way. What mathematical operation should you apply to the radius in the formula A = πr?</response>
</example>`;

    // Input data
    PROMPT += `\n\n<code>${CODE}</code>`;

    // Rules
    PROMPT += `\n\nRemember: Do not give too much help! Your goal is to guide the user to discover the issue themselves.`;

    const response = await getCompletionWithPrefill(PROMPT);

    function gradeExercise(text) {
        // Check for division by zero mention and issue tags
        const hasBug = /division|divide.*zero|zero.*division|i\s*=\s*0/i.test(text);
        const hasIssueTags = /<issue>/i.test(text);
        return hasBug && hasIssueTags;
    }

    console.log('Code to debug:');
    console.log(CODE);
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
            results.push(await exercise9_1());
            results.push(await exercise9_2());

            const passed = results.filter(r => r).length;
            const total = results.length;

            console.log('\n========================================');
            console.log(`RESULTS: ${passed}/${total} exercises passed`);
            console.log('========================================\n');

            if (passed === total) {
                console.log('🎉🎉🎉 CONGRATULATIONS! 🎉🎉🎉');
                console.log('You have completed ALL exercises in the Prompt Engineering Tutorial!\n');

                console.log('📚 What you\'ve mastered:');
                console.log('   ✅ Basic prompt structure and API usage');
                console.log('   ✅ Being clear and direct with instructions');
                console.log('   ✅ Role prompting for different contexts');
                console.log('   ✅ Separating data from instructions with XML');
                console.log('   ✅ Formatting output and prefilling responses');
                console.log('   ✅ Precognition and step-by-step thinking');
                console.log('   ✅ Few-shot prompting with examples');
                console.log('   ✅ Avoiding hallucinations with evidence');
                console.log('   ✅ Complex prompt assembly framework\n');

                console.log('🚀 Next Steps:');
                console.log('   • Explore the Appendix chapters (10.1-10.3) for advanced topics');
                console.log('   • Check out the Anthropic Prompt Library for more examples');
                console.log('   • Visit the Anthropic documentation for latest features');
                console.log('   • Build your own applications with these techniques!\n');

                console.log('💡 Remember:');
                console.log('   "The best prompt is the one that works for YOUR use case."');
                console.log('   Start comprehensive, then refine. Happy prompting! 🎊\n');
            } else {
                console.log('💡 Some exercises need work. Check the output above for details.');
                console.log('💡 Hint: Run showHint("exercise_9_X") for help.\n');
            }
        }

        // Guidance based on RUN mode
        if (RUN === "EXAMPLES") {
            console.log('💡 To practice these concepts, run: RUN=EXERCISES node tutorials/09_Complex_Prompts_from_Scratch.js');
        } else if (RUN === "EXERCISES") {
            console.log('💡 To review examples, run: RUN=EXAMPLES node tutorials/09_Complex_Prompts_from_Scratch.js');
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
export { exercise9_1, exercise9_2, getCompletionWithPrefill };
