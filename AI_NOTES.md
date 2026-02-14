# AI Notes

## LLM & Provider
- **Provider**: [Puter.js](https://puter.com)
- **Model**: `gpt-4o`
- **Why**: Puter.js provides a seamless, keyless client-side AI integration that is perfect for lightweight applications. It allows for fast prototyping without complex backend proxying, while still providing high-quality results from state-of-the-art models like GPT-4o.

## Usage of AI during Development
- **UI Design**: AI was used to generate the modern, glassmorphic design system and Tailwind color palettes.
- **Logic Mapping**: AI assisted in architecting the chaining logic where the output of one step becomes the input to the next.
- **Boilerplate**: AI generated the initial setup for MongoDB connection and Next.js API routes.

## Self-Checked & Manual Work
- **Process Orchestration**: I manually defined the loop that handles the sequential execution of steps and state updates in the UI.
- **Responsiveness**: I manually ensured that the layout stays "neat" and functional on mobile devices using Tailwind's responsive prefixes.
- **Error Handling**: I implemented the try-catch blocks and UI indicators for step failures.
- **Database Schema**: Manually designed the flat history schema for MongoDB.
