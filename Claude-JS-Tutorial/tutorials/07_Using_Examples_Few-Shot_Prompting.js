#!/usr/bin/env node

/**
 * Chapter 7: Using Examples (Few-Shot Prompting)
 *
 * Learn how giving Claude examples of desired behavior is extremely effective
 * for getting the right answer in the right format. Also known as "few-shot prompting".
 */

import { getCompletion, client, MODEL_NAME, RUN } from './00_Tutorial_How-To.js';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('# Chapter 7: Using Examples (Few-Shot Prompting)\n');

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
// EXAMPLES - Learn about few-shot prompting
// ============================================================================

async function runExamples() {
    console.log('========================================');
    console.log('EXAMPLES - Few-Shot Prompting');
    console.log('========================================\n');

    // Example 1: Problem - Formal, robotic response
    console.log('--- Example 1: Problem - Formal Response ---\n');
    const PROMPT1 = "Will Santa bring me presents on Christmas?";

    console.log('Prompt:', PROMPT1);
    const response1 = await getCompletionWithPrefill(PROMPT1);
    console.log('\nClaude\'s response:');
    console.log(response1);
    console.log('\n💡 Note: Default response is quite formal and robotic');
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 2: Solution - Few-shot examples for better tone
    console.log('--- Example 2: Solution - Few-Shot Example for Tone ---\n');
    const PROMPT2 = `Please complete the conversation by writing the next line, speaking as "A".
Q: Is the tooth fairy real?
A: Of course, sweetie. Wrap up your tooth and put it under your pillow tonight. There might be something waiting for you in the morning.
Q: Will Santa bring me presents on Christmas?`;

    console.log('Prompt:', PROMPT2);
    const response2 = await getCompletionWithPrefill(PROMPT2);
    console.log('\nClaude\'s response:');
    console.log(response2);
    console.log('\n💡 By providing an example, Claude matches the warm, parental tone!');
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 3: Few-shot for complex formatting
    console.log('--- Example 3: Few-Shot for Complex Formatting ---\n');
    const PROMPT3 = `Silvermist Hollow, a charming village, was home to an extraordinary group of individuals.
Among them was Dr. Liam Patel, a neurosurgeon who revolutionized surgical techniques at the regional medical center.
Olivia Chen was an innovative architect who transformed the village's landscape with her sustainable and breathtaking designs.
The local theater was graced by the enchanting symphonies of Ethan Kovacs, a professionally-trained musician and composer.
Isabella Torres, a self-taught chef with a passion for locally sourced ingredients, created a culinary sensation with her farm-to-table restaurant, which became a must-visit destination for food lovers.
These remarkable individuals, each with their distinct talents, contributed to the vibrant tapestry of life in Silvermist Hollow.
<individuals>
1. Dr. Liam Patel [NEUROSURGEON]
2. Olivia Chen [ARCHITECT]
3. Ethan Kovacs [MISICIAN AND COMPOSER]
4. Isabella Torres [CHEF]
</individuals>

At the heart of the town, Chef Oliver Hamilton has transformed the culinary scene with his farm-to-table restaurant, Green Plate. Oliver's dedication to sourcing local, organic ingredients has earned the establishment rave reviews from food critics and locals alike.
Just down the street, you'll find the Riverside Grove Library, where head librarian Elizabeth Chen has worked diligently to create a welcoming and inclusive space for all. Her efforts to expand the library's offerings and establish reading programs for children have had a significant impact on the town's literacy rates.
As you stroll through the charming town square, you'll be captivated by the beautiful murals adorning the walls. These masterpieces are the work of renowned artist, Isabella Torres, whose talent for capturing the essence of Riverside Grove has brought the town to life.
Riverside Grove's athletic achievements are also worth noting, thanks to former Olympic swimmer-turned-coach, Marcus Jenkins. Marcus has used his experience and passion to train the town's youth, leading the Riverside Grove Swim Team to several regional championships.
<individuals>
1. Oliver Hamilton [CHEF]
2. Elizabeth Chen [LIBRARIAN]
3. Isabella Torres [ARTIST]
4. Marcus Jenkins [COACH]
</individuals>

Oak Valley, a charming small town, is home to a remarkable trio of individuals whose skills and dedication have left a lasting impact on the community.
At the town's bustling farmer's market, you'll find Laura Simmons, a passionate organic farmer known for her delicious and sustainably grown produce. Her dedication to promoting healthy eating has inspired the town to embrace a more eco-conscious lifestyle.
In Oak Valley's community center, Kevin Alvarez, a skilled dance instructor, has brought the joy of movement to people of all ages. His inclusive dance classes have fostered a sense of unity and self-expression among residents, enriching the local arts scene.
Lastly, Rachel O'Connor, a tireless volunteer, dedicates her time to various charitable initiatives. Her commitment to improving the lives of others has been instrumental in creating a strong sense of community within Oak Valley.
Through their unique talents and unwavering dedication, Laura, Kevin, and Rachel have woven themselves into the fabric of Oak Valley, helping to create a vibrant and thriving small town.`;

    const PREFILL3 = "<individuals>";

    console.log('USER TURN:');
    console.log(PROMPT3);
    console.log('\nASSISTANT TURN:');
    console.log(PREFILL3);

    const response3 = await getCompletionWithPrefill(PROMPT3, "", PREFILL3);
    console.log('\nClaude\'s response:');
    console.log(response3);
    console.log('\n💡 Claude extrapolates the formatting pattern from examples!');
    console.log('💡 No need to explain step-by-step formatting instructions');
    console.log('\n' + '='.repeat(80) + '\n');

    console.log('💡 Key Takeaways:');
    console.log('   - Few-shot prompting = providing examples of desired behavior');
    console.log('   - Examples are more effective than lengthy descriptions');
    console.log('   - Claude can extrapolate patterns from just 1-2 examples');
    console.log('   - Works for both tone/style and complex formatting');
    console.log('   - "Zero-shot" = no examples, "one-shot" = 1 example, "few-shot" = multiple examples\n');
}

// ============================================================================
// EXERCISES - Practice few-shot prompting
// ============================================================================

async function exercise7_1() {
    console.log('=== EXERCISE 7.1 - Email Formatting via Examples ===\n');
    console.log('Task: Use few-shot examples to classify emails correctly.');
    console.log('      The LAST letter of output should be the category letter.');
    console.log('Categories:');
    console.log('  (A) Pre-sale question');
    console.log('  (B) Broken or defective item');
    console.log('  (C) Billing question');
    console.log('  (D) Other (please explain)');
    console.log('Grading: Last character must be correct category letter\n');

    const PROMPT = "[Replace this text]";
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

    let allCorrect = true;

    for (let i = 0; i < EMAILS.length; i++) {
        const email = EMAILS[i];
        const formattedPrompt = PROMPT.replace('{email}', email);

        const response = await getCompletionWithPrefill(formattedPrompt, "", PREFILL);

        // Grade by checking if last character matches any valid answer
        const lastChar = response.trim().slice(-1);
        const grade = ANSWERS[i].includes(lastChar);

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
            results.push(await exercise7_1());

            const passed = results.filter(r => r).length;
            const total = results.length;

            console.log('\n========================================');
            console.log(`RESULTS: ${passed}/${total} exercises passed`);
            console.log('========================================\n');

            if (passed === total) {
                console.log('🎉 Congratulations! All exercises completed successfully!');
                console.log('You\'re ready to move to Chapter 8: Avoiding Hallucinations\n');
            } else {
                console.log('💡 Some exercises need work. Check the output above for details.');
                console.log('💡 Hint: Run showHint("exercise_7_1") for help.\n');
            }
        }

        // Guidance based on RUN mode
        if (RUN === "EXAMPLES") {
            console.log('💡 To practice these concepts, run: RUN=EXERCISES node tutorials/07_Using_Examples_Few-Shot_Prompting.js');
        } else if (RUN === "EXERCISES") {
            console.log('💡 To review examples, run: RUN=EXAMPLES node tutorials/07_Using_Examples_Few-Shot_Prompting.js');
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
export { exercise7_1, getCompletionWithPrefill };
