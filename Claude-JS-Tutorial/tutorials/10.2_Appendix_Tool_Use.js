#!/usr/bin/env node

/**
 * Appendix 10.2: Tool Use (Function Calling)
 *
 * Learn how to enable Claude to invoke external tools and functions.
 * Tool use is an advanced application of prompt chaining where Claude outputs
 * structured tool requests that your code executes and returns results to Claude.
 */

import { getCompletion, client, MODEL_NAME, RUN } from './00_Tutorial_How-To.js';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('# Appendix 10.2: Tool Use (Function Calling)\n');

/**
 * Helper function with stop sequences support
 * Stop sequences halt generation at specified strings
 */
async function getCompletionWithStop(messages, systemPrompt = "", stopSequences = null) {
    try {
        const params = {
            model: MODEL_NAME,
            max_tokens: 2000,
            temperature: 0.0,
            system: systemPrompt || undefined,
            messages: messages
        };

        if (stopSequences) {
            params.stop_sequences = stopSequences;
        }

        const response = await client.messages.create(params);
        return response.content[0].text;
    } catch (error) {
        console.error('Error calling Claude API:', error.message);
        throw error;
    }
}

/**
 * Extract parameter value from Claude's tool call XML
 */
function findParameter(message, parameterName) {
    const parameterStartString = `name="${parameterName}">`;
    const startIndex = message.indexOf(parameterStartString);

    if (startIndex === -1) {
        return null;
    }

    const start = startIndex + parameterStartString.length;
    const end = message.indexOf('</parameter>', start);

    return message.substring(start, end);
}

/**
 * Format function results for Claude
 */
function constructSuccessfulFunctionRunInjectionPrompt(invokeResults) {
    let resultString = '\n<function_results>';

    for (const result of invokeResults) {
        resultString += `\n<result>\n<tool_name>${result.tool_name}</tool_name>\n<stdout>\n${result.tool_result}\n</stdout>\n</result>`;
    }

    resultString += '\n</function_results>';
    return resultString;
}

// ============================================================================
// TOOL DEFINITIONS AND SYSTEM PROMPTS
// ============================================================================

// General tool use explanation (reusable for any tools)
const SYSTEM_PROMPT_TOOLS_GENERAL = `In this environment you have access to a set of tools you can use to answer the user's question.

You may call them like this. Only invoke one function at a time and wait for the results before invoking another function:
<function_calls>
<invoke name="$TOOL_NAME">
<parameter name="$PARAMETER_NAME">$PARAMETER_VALUE</parameter>
...
</invoke>
</function_calls>

Here are the tools available:`;

// Specific calculator tool definition
const SYSTEM_PROMPT_TOOLS_CALCULATOR = `
<tools>
  <tool_description>
    <tool_name>do_pairwise_arithmetic</tool_name>
    <description>
      Calculator function for doing basic arithmetic operations on a pair of numbers.
      Supports addition, subtraction, multiplication, and division.
    </description>
    <parameters>
      <parameter>
        <name>first_operand</name>
        <type>int</type>
        <description>First operand (before the operator)</description>
      </parameter>
      <parameter>
        <name>second_operand</name>
        <type>int</type>
        <description>Second operand (after the operator)</description>
      </parameter>
      <parameter>
        <name>operator</name>
        <type>str</type>
        <description>The operation to perform. Must be one of '+', '-', '*', or '/'</description>
      </parameter>
    </parameters>
  </tool_description>
</tools>`;

// Combined system prompt for calculator
const SYSTEM_PROMPT_CALCULATOR = SYSTEM_PROMPT_TOOLS_GENERAL + SYSTEM_PROMPT_TOOLS_CALCULATOR;

// ============================================================================
// TOOL IMPLEMENTATIONS
// ============================================================================

/**
 * Calculator tool implementation
 */
function doPairwiseArithmetic(num1, num2, operation) {
    if (operation === '+') return num1 + num2;
    else if (operation === '-') return num1 - num2;
    else if (operation === '*') return num1 * num2;
    else if (operation === '/') return num1 / num2;
    else return "Error: Operation not supported.";
}

// ============================================================================
// EXAMPLES - Learn about tool use
// ============================================================================

async function runExamples() {
    console.log('========================================');
    console.log('EXAMPLES - Tool Use (Function Calling)');
    console.log('========================================\n');

    console.log('💡 Tool Use Concept:');
    console.log('   - Claude does NOT directly call functions');
    console.log('   - Three-step process:');
    console.log('     1. Claude outputs tool request in XML format');
    console.log('     2. Your code executes the tool');
    console.log('     3. Results returned to Claude for final response');
    console.log('   - Builds on prompt chaining from Appendix 10.1\n');
    console.log('='.repeat(80) + '\n');

    // Example 1: Calculator Tool (Complete Workflow)
    console.log('--- Example 1: Calculator Tool (Complete Workflow) ---\n');

    const multiplicationMessage = {
        role: "user",
        content: "Multiply 1984135 by 9343116. Only respond with the answer."
    };

    // Step 1: Send request with tool definitions
    const stopSequences = ["</function_calls>"];

    const functionCallingResponse = await getCompletionWithStop(
        [multiplicationMessage],
        SYSTEM_PROMPT_CALCULATOR,
        stopSequences
    );

    console.log('Step 1 - Claude\'s tool call request:');
    console.log(functionCallingResponse);
    console.log('</function_calls>');

    // Step 2: Parse parameters and execute tool
    const num1 = parseInt(findParameter(functionCallingResponse, "first_operand"));
    const num2 = parseInt(findParameter(functionCallingResponse, "second_operand"));
    const operator = findParameter(functionCallingResponse, "operator");

    const result = doPairwiseArithmetic(num1, num2, operator);

    console.log('\nStep 2 - Extracted parameters and executed:');
    console.log(`  first_operand: ${num1}`);
    console.log(`  second_operand: ${num2}`);
    console.log(`  operator: ${operator}`);
    console.log(`  result: ${result.toLocaleString()}`);

    // Step 3: Format results and send back to Claude
    const formattedResults = [{
        tool_name: 'do_pairwise_arithmetic',
        tool_result: result
    }];

    const functionResults = constructSuccessfulFunctionRunInjectionPrompt(formattedResults);

    const fullFirstResponse = functionCallingResponse + "</function_calls>";

    const messages = [
        multiplicationMessage,
        { role: "assistant", content: fullFirstResponse },
        { role: "user", content: functionResults }
    ];

    const finalResponse = await getCompletionWithStop(messages, SYSTEM_PROMPT_CALCULATOR);

    console.log('\nStep 3 - Function results sent to Claude:');
    console.log(functionResults);

    console.log('\nStep 4 - Claude\'s final response to user:');
    console.log(finalResponse);

    console.log('\n💡 Complete tool use workflow demonstrated!');
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 2: Non-Tool Question
    console.log('--- Example 2: Claude Knows When NOT to Use Tools ---\n');

    const nonToolMessage = {
        role: "user",
        content: "What's the capital of France?"
    };

    const nonToolResponse = await getCompletionWithStop(
        [nonToolMessage],
        SYSTEM_PROMPT_CALCULATOR
    );

    console.log('Question: "What\'s the capital of France?"');
    console.log('\nClaude\'s response:');
    console.log(nonToolResponse);
    console.log('\n💡 Claude correctly identifies when NOT to use tools!');
    console.log('\n' + '='.repeat(80) + '\n');

    console.log('💡 Key Takeaways:');
    console.log('   - Tool use = structured way for Claude to request function calls');
    console.log('   - Uses XML format Claude was specifically trained on');
    console.log('   - Stop sequences prevent Claude from continuing after tool call');
    console.log('   - Your code orchestrates: parse request → execute → return results');
    console.log('   - Claude shows good judgment about when to use/not use tools');
    console.log('   - Foundation for agentic systems and complex workflows\n');
}

// ============================================================================
// EXERCISE - SQL Database Tools
// ============================================================================

// Mock database
const db = {
    users: [
        { id: 1, name: "Alice", email: "alice@example.com" },
        { id: 2, name: "Bob", email: "bob@example.com" }
    ],
    products: [
        { id: 1, name: "Widget", price: 9.99 },
        { id: 2, name: "Gadget", price: 14.99 }
    ]
};

// Database tool implementations
function getUser(userId) {
    const user = db.users.find(u => u.id === userId);
    return user ? JSON.stringify(user) : "User not found";
}

function getProduct(productId) {
    const product = db.products.find(p => p.id === productId);
    return product ? JSON.stringify(product) : "Product not found";
}

function addUser(name, email) {
    const newId = Math.max(...db.users.map(u => u.id)) + 1;
    const newUser = { id: newId, name, email };
    db.users.push(newUser);
    return `User added: ${JSON.stringify(newUser)}`;
}

function addProduct(name, price) {
    const newId = Math.max(...db.products.map(p => p.id)) + 1;
    const newProduct = { id: newId, name, price: parseFloat(price) };
    db.products.push(newProduct);
    return `Product added: ${JSON.stringify(newProduct)}`;
}

async function exercise10_2() {
    console.log('=== EXERCISE 10.2 - SQL Database Tools ===\n');
    console.log('Task: Define tool schemas for 4 database functions:');
    console.log('      get_user, get_product, add_user, add_product');
    console.log('Grading: Tests various database operations\n');

    // Solution: Complete tool definitions
    const SYSTEM_PROMPT_SQL_TOOLS = `
<tools>
  <tool_description>
    <tool_name>get_user</tool_name>
    <description>Retrieves user information by user ID from the database</description>
    <parameters>
      <parameter>
        <name>user_id</name>
        <type>int</type>
        <description>The ID of the user to retrieve</description>
      </parameter>
    </parameters>
  </tool_description>

  <tool_description>
    <tool_name>get_product</tool_name>
    <description>Retrieves product information by product ID from the database</description>
    <parameters>
      <parameter>
        <name>product_id</name>
        <type>int</type>
        <description>The ID of the product to retrieve</description>
      </parameter>
    </parameters>
  </tool_description>

  <tool_description>
    <tool_name>add_user</tool_name>
    <description>Adds a new user to the database</description>
    <parameters>
      <parameter>
        <name>name</name>
        <type>str</type>
        <description>The name of the new user</description>
      </parameter>
      <parameter>
        <name>email</name>
        <type>str</type>
        <description>The email address of the new user</description>
      </parameter>
    </parameters>
  </tool_description>

  <tool_description>
    <tool_name>add_product</tool_name>
    <description>Adds a new product to the database</description>
    <parameters>
      <parameter>
        <name>name</name>
        <type>str</type>
        <description>The name of the new product</description>
      </parameter>
      <parameter>
        <name>price</name>
        <type>float</type>
        <description>The price of the new product</description>
      </parameter>
    </parameters>
  </tool_description>
</tools>`;

    const SYSTEM_PROMPT_SQL = SYSTEM_PROMPT_TOOLS_GENERAL + SYSTEM_PROMPT_SQL_TOOLS;

    const testQueries = [
        "Add a new user named Charlie with email charlie@example.com",
        "Add a new product called Thingamajig with price $24.99",
        "Get the user with ID 1",
        "Get the product with ID 2"
    ];

    let allPassed = true;

    for (const query of testQueries) {
        console.log(`\n--- Testing: "${query}" ---`);

        const response = await getCompletionWithStop(
            [{ role: "user", content: query }],
            SYSTEM_PROMPT_SQL,
            ["</function_calls>"]
        );

        console.log('Claude\'s tool call:');
        console.log(response + '</function_calls>');

        // Extract tool name
        const toolNameMatch = response.match(/name="([^"]+)"/);
        const toolName = toolNameMatch ? toolNameMatch[1] : null;

        if (toolName) {
            let result;

            if (toolName === 'get_user') {
                const userId = parseInt(findParameter(response, 'user_id'));
                result = getUser(userId);
            } else if (toolName === 'get_product') {
                const productId = parseInt(findParameter(response, 'product_id'));
                result = getProduct(productId);
            } else if (toolName === 'add_user') {
                const name = findParameter(response, 'name');
                const email = findParameter(response, 'email');
                result = addUser(name, email);
            } else if (toolName === 'add_product') {
                const name = findParameter(response, 'name');
                const price = findParameter(response, 'price');
                result = addProduct(name, price);
            }

            console.log('\nTool executed, result:', result);
            console.log('✓ Test passed');
        } else {
            console.log('✗ Test failed - no valid tool call');
            allPassed = false;
        }
    }

    console.log('\n--- GRADING ---');
    console.log('This exercise has been correctly solved:', allPassed);

    return allPassed;
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

            const result = await exercise10_2();

            console.log('\n========================================');
            console.log(`RESULT: Exercise ${result ? 'PASSED' : 'FAILED'}`);
            console.log('========================================\n');

            if (result) {
                console.log('🎉 Congratulations! You\'ve mastered tool use!');
                console.log('🔗 Continue to Appendix 10.3 for Search & Retrieval patterns\n');
            } else {
                console.log('💡 Review the examples and try again.');
                console.log('💡 Focus on the XML structure for tool definitions.\n');
            }
        }

        // Guidance based on RUN mode
        if (RUN === "EXAMPLES") {
            console.log('💡 To practice, run: RUN=EXERCISES node tutorials/10.2_Appendix_Tool_Use.js');
        } else if (RUN === "EXERCISES") {
            console.log('💡 To review examples, run: RUN=EXAMPLES node tutorials/10.2_Appendix_Tool_Use.js');
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
export { getCompletionWithStop, findParameter, constructSuccessfulFunctionRunInjectionPrompt, exercise10_2 };
