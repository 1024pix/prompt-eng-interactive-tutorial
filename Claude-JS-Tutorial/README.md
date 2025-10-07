# Welcome to Anthropic's Prompt Engineering Interactive Tutorial - JavaScript Edition

## Course Introduction and Goals

This course is intended to provide you with a comprehensive step-by-step understanding of how to engineer optimal prompts within Claude, using JavaScript and the Anthropic SDK.

**After completing this course, you will be able to**:
- Master the basic structure of a good prompt
- Recognize common failure modes and learn the '80/20' techniques to address them
- Understand Claude's strengths and weaknesses
- Build strong prompts from scratch for common use cases

## Course Structure and Content

This course is structured to allow you many chances to practice writing and troubleshooting prompts yourself. The course is broken up into **10 chapters with accompanying exercises** (Chapters 0-9), as well as **3 appendix chapters** covering advanced methods. It is intended for you to **work through the course in chapter order**.

**Each lesson has executable JavaScript code** where you can experiment with the examples in the lesson and see for yourself how changing prompts can change Claude's responses. There is also an [answer key](https://docs.google.com/spreadsheets/d/1jIxjzUWG-6xBVIa2ay6yDpLyeuOh_hR_ZB75a47KX_E/edit?usp=sharing) for the original Python version.

Note: This tutorial uses our smallest, fastest, and cheapest model, Claude 3 Haiku. Anthropic has [two other models](https://docs.anthropic.com/claude/docs/models-overview), Claude 3 Sonnet and Claude 3 Opus, which are more intelligent than Haiku, with Opus being the most intelligent.

## How to Get Started

### Prerequisites
- Node.js 18.0.0 or higher
- An Anthropic API key ([sign up here](https://console.anthropic.com/))

## How to get an Anthropic API Key

- First, go to the Anthropic console, and create a [individual org](https://console.anthropic.com/) account : https://console.anthropic.com/ (I would suggest to use an alas like me**+apikey**@email.com)
- you'll get a free $5 for one year, that allows you to setup an API key

https://zapier.com/blog/claude-api/#connections 

### Installation

1. **Clone this repository to your local machine:**
   ```bash
   git clone <repository-url>
   cd Claude-JS-Tutorial
   ```

2. **Install the required dependencies:**
   ```bash
   npm install
   ```

3. **Set up your API key and configuration:**
   ```bash
   cp .env.example .env
   # Edit .env and replace "your_api_key_here" with your actual Anthropic API key
   # Set RUN to control what sections to run (see Exercise Control below)
   ```

4. **Test your setup:**
   ```bash
   npm start
   # or
   node tutorials/00_Tutorial_How-To.js
   ```

### Running Individual Tutorials

Each tutorial can be run independently:

```bash
node tutorials/01_Basic_Prompt_Structure.js
node tutorials/02_Being_Clear_and_Direct.js
node tutorials/03_Assigning_Roles_Role_Prompting.js
# ... and so on
```

### Exercise Control

Control what sections of each tutorial to run using the `RUN` environment variable:

1. **Examples Only** (default):
   ```bash
   # In .env file:
   RUN=EXAMPLES
   ```
   - Shows lesson examples and explanations only
   - Perfect for learning concepts first
   - Faster to run through
   - Tells you how to access exercises when ready

2. **Exercises Only**:
   ```bash
   # In .env file:
   RUN=EXERCISES
   ```
   - Shows interactive exercises only
   - Exercises require you to modify prompts
   - Includes automated grading and feedback
   - Tells you how to access examples if needed

3. **Everything**:
   ```bash
   # In .env file:
   RUN=ALL
   ```
   - Shows both examples and exercises
   - Complete learning experience
   - Takes longer to run through

## Table of Contents

Each chapter consists of a lesson and a set of exercises.

### Beginner
- **Chapter 0:** [Tutorial How-To](tutorials/00_Tutorial_How-To.js) - Setup and introduction
- **Chapter 1:** [Basic Prompt Structure](tutorials/01_Basic_Prompt_Structure.js)
- **Chapter 2:** [Being Clear and Direct](tutorials/02_Being_Clear_and_Direct.js)
- **Chapter 3:** [Assigning Roles](tutorials/03_Assigning_Roles_Role_Prompting.js)

### Intermediate
- **Chapter 4:** [Separating Data from Instructions](tutorials/04_Separating_Data_and_Instructions.js)
- **Chapter 5:** [Formatting Output & Speaking for Claude](tutorials/05_Formatting_Output_and_Speaking_for_Claude.js)
- **Chapter 6:** [Precognition (Thinking Step by Step)](tutorials/06_Precognition_Thinking_Step_by_Step.js)
- **Chapter 7:** [Using Examples](tutorials/07_Using_Examples_Few-Shot_Prompting.js)

### Advanced
- **Chapter 8:** [Avoiding Hallucinations](tutorials/08_Avoiding_Hallucinations.js)
- **Chapter 9:** [Building Complex Prompts (Industry Use Cases)](tutorials/09_Complex_Prompts_from_Scratch.js)

### Appendix
- **Chapter 10.1:** [Chaining Prompts](tutorials/10.1_Appendix_Chaining_Prompts.js)
- **Chapter 10.2:** [Tool Use](tutorials/10.2_Appendix_Tool_Use.js)
- **Chapter 10.3:** [Search & Retrieval](tutorials/10.3_Appendix_Search_and_Retrieval.js)

## Features

### ✅ Implemented
- **Modern JavaScript**: Uses ES modules and modern async/await syntax
- **TypeScript SDK**: Built with the official Anthropic JavaScript/TypeScript SDK
- **Environment Configuration**: Secure API key management with .env files
- **Interactive Examples**: Each lesson includes runnable code examples
- **Exercise Control**: Flexible section control via `RUN` environment variable (EXAMPLES/EXERCISES/ALL)
- **Exercise Validation**: Automated grading functions for exercises
- **Helpful Hints**: JavaScript-specific hints for each exercise
- **Error Handling**: Robust error handling for API calls

### 🎯 Future Enhancements
- Additional exercise validations
- More comprehensive error messages
- Interactive web-based version

## Usage Notes & Tips 💡

- This course uses Claude 3 Haiku with temperature 0 for deterministic results
- All prompt engineering techniques also apply to other Claude models
- You can modify any prompt in the examples to see how it affects Claude's responses
- Each tutorial file can be run independently
- Use the hints system if you get stuck: `import { showHint } from './hints.js'`

## Project Structure

```
Claude-JS-Tutorial/
├── tutorials/           # Individual tutorial files
│   ├── 00_Tutorial_How-To.js
│   ├── 01_Basic_Prompt_Structure.js
│   ├── 02_Being_Clear_and_Direct.js
│   ├── 03_Assigning_Roles_Role_Prompting.js
│   └── ...
├── hints.js            # Exercise hints and solutions
├── tutorial-template.js # Template for creating new tutorials
├── package.json        # Dependencies and scripts
├── .env.example        # Environment configuration template
└── README.md          # This file
```

## Contributing

To implement the remaining tutorials (Chapters 4-10):

1. Use the `tutorial-template.js` as a starting point
2. Convert the corresponding `.ipynb` file from the `Anthropic 1P` directory
3. Follow the patterns established in Chapters 1-3
4. Ensure all exercises have proper grading functions
5. Test with various prompts to ensure robustness

## API Reference

This tutorial uses the [Anthropic JavaScript SDK](https://docs.claude.com/en/docs/claude-code/sdk/sdk-typescript). Key functions:

- `getCompletion(prompt)` - Basic completion with just a user prompt
- `getCompletionWithSystem(prompt, systemPrompt)` - Completion with system prompt
- All functions return Claude's response as a string

## Troubleshooting

### Common Issues

1. **API Key Errors**: Make sure your `.env` file has the correct `TUTORIAL_ANTHROPIC_API_KEY`
2. **Module Import Errors**: Ensure you're using Node.js 18+ with ES modules support
3. **Rate Limiting**: If you hit rate limits, add delays between API calls

### Getting Help

- Check the original [Python tutorial](../Anthropic%201P/) for reference
- View the [static answer key](https://docs.google.com/spreadsheets/d/1jIxjzUWG-6xBVIa2ay6yDpLyeuOh_hR_ZB75a47KX_E/edit?usp=sharing)
- Use the hints system for exercise-specific guidance

## License

This project maintains the same license as the original Anthropic tutorial.

---

🚀 **Ready to begin?** Run `npm start` or `node tutorials/00_Tutorial_How-To.js` to get started!