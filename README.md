# Workflow Builder Lite

A lightweight, modern workflow automation tool built with **Next.js**, **Puter.js**, and **MongoDB**.

![Workflow Builder Lite Screenshot](/showcase/screenshot.png)

## Features
- **Workflow Builder**: Create 2-4 step AI-powered chains.
- **Step Types**: Clean text, Summarize, Extract key points, and Tag category.
- **Live Execution**: Watch each step process in real-time with chained outputs.
- **Run History**: View logs of your last 20 executions.
- **System Health**: Monitor backend, database, and LLM connectivity.
- **Mobile Responsive**: Fully optimized for a premium mobile experience with smooth glassmorphism UI.

## How to Run locally
1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env.local` file and add your MongoDB URI:
    ```env
    
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
5.  **Open in Browser**: Navigate to `http://localhost:3000`.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **AI Engine**: Puter.js (using `gpt-4o`)
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## What is Done
- Full workflow building and execution logic.
- Chaining of outputs between steps.
- Persistence of run history in MongoDB.
- Real-time health check system.
- Premium UI with glassmorphism and motion.

## What is Not Done
- Persistence of workflow *templates* (currently workflows are ephemeral until run).
- Manual re-ordering of steps once added.
- Advanced parameter tuning for each AI step.



