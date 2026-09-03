# Easy Note Taker (ENT)

> **Capture It. Plan It. Get It Done.**

Easy Note Taker (ENT) is an AI-powered productivity web application designed to help students and professionals organise information, manage tasks, plan their time, conduct research, and improve workplace communication.

The application combines multiple AI-powered tools into one simple and professional productivity platform.

---

## Project Overview

Easy Note Taker was developed to address common productivity challenges faced by students and professionals, including:

* Managing multiple tasks and deadlines
* Organising meeting information
* Writing professional emails
* Conducting research efficiently
* Prioritising daily activities
* Accessing an AI assistant for productivity support

ENT provides a centralised dashboard where users can access AI-powered tools to capture information, organise their workload and improve productivity.

The application follows a simple workflow:

**Input → AI Processing → Review → Edit → Use**

The system is designed to support users rather than replace human decision-making. Users remain responsible for reviewing and verifying AI-generated information.

---

## Features Implemented

### 1. Smart Email Generator

The Smart Email Generator helps users create professional emails using AI.

Users can provide:

* Email purpose
* Topic
* Key points
* Preferred tone
* Desired length

The AI generates a professional email that users can:

* Review
* Edit
* Copy
* Regenerate

---

### 2. Meeting Notes Summarizer

The Meeting Notes Summarizer converts unstructured meeting notes into an organised summary.

The tool generates:

* Meeting summary
* Key discussion points
* Decisions made
* Action items
* Deadlines
* Follow-up activities

Users can edit, copy or regenerate the generated content.

---

### 3. AI Task Planner / Scheduler

The AI Task Planner helps users organise and prioritise their workload.

Users can create tasks containing:

* Task name
* Description
* Deadline
* Estimated duration
* Priority
* Status

The AI can assist with:

* Task prioritisation
* Identifying urgent tasks
* Daily scheduling
* Weekly scheduling
* Time allocation

Tasks can be marked as:

* Not Started
* In Progress
* Completed

---

### 4. AI Research Assistant

The AI Research Assistant helps users explore topics and generate structured research insights.

Users enter a research topic or question and can receive:

* Topic overview
* Key concepts
* Key findings
* Advantages
* Disadvantages
* Insights
* Recommendations
* Further research areas

AI-generated research should be reviewed and verified using reliable sources before being used academically or professionally.

---

### 5. ENT AI Assistant

ENT Assistant is an interactive AI chatbot designed to support users with productivity-related activities.

Users can ask questions such as:

* How should I prioritise my tasks?
* Help me prepare for a meeting.
* Help me write a professional email.
* Summarise these notes.
* Explain this topic in simple terms.

The chatbot provides an interactive conversation interface with AI-generated responses.

---

### 6. Productivity Dashboard

The dashboard provides an overview of the user's productivity.

It includes:

* Tasks Today
* Completed Tasks
* Pending Tasks
* High Priority Tasks
* Today's Tasks
* Quick AI Actions
* AI Productivity Insights

---

### 7. Responsive Design

The application is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile devices

The sidebar adapts to smaller screens through a responsive navigation menu.

---

### 8. Responsible AI

Easy Note Taker includes responsible AI guidance to encourage users to review and verify AI-generated information.

The application communicates that:

* AI-generated content may contain errors.
* Users should verify important information.
* Users should maintain human oversight.
* Confidential information should not be unnecessarily entered into AI tools.
* AI should support human decision-making rather than replace it.

---

# Technologies and Tools Used

## Frontend

* React
* TypeScript
* HTML5
* CSS
* Responsive UI components

## AI

* AI-powered text generation
* AI-powered summarisation
* AI-powered task prioritisation
* AI-powered research assistance
* AI chatbot functionality

## Development Tools

* Lovable AI
* GitHub
* Git
* Visual Studio Code

## Design

* Responsive SaaS dashboard design
* Black, green, yellow and white colour theme
* Modern card-based interface
* Responsive sidebar navigation

---

# Getting Started

## Prerequisites

Before running the project locally, make sure you have the following installed:

* Node.js
* npm
* Git

You will also need any required AI API credentials configured through environment variables if the deployed version requires an external AI service.

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/easy-note-taker.git
```

### 2. Navigate into the project directory

```bash
cd easy-note-taker
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

If the project requires an AI API, create a `.env` file in the project root and add the required environment variables.

Example:

```env
VITE_AI_API_KEY=your_api_key_here
```

**Do not commit API keys, passwords, tokens or other sensitive credentials to GitHub.**

Make sure `.env` is included in `.gitignore`.

---

### 5. Start the development server

```bash
npm run dev
```

The application should then be available through the local development URL provided by the terminal.

---

# Project Structure

A simplified structure of the application is:

```text
easy-note-taker/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── assets/
│   └── App.*
│
├── .env
├── .gitignore
├── package.json
├── README.md
└── ...
```

The exact structure may vary depending on the final implementation.

---

# Team Members

### Project Team

| Name              | Role           |
| ----------------- | -------------- |
| Kholiswa Dhladhla | Project Member |
| Vussero           | Project Member |
| Tabang            | Project Member |
| Beil              | Project Member |
| [Add Name]        | Project Member |

> Update the team member names and roles above to match the final project team before submission.

---

# Project Objectives

The main objectives of Easy Note Taker are to:

1. Improve productivity through AI-assisted tools.
2. Help users organise and prioritise tasks.
3. Reduce the time required to create professional workplace communication.
4. Convert unstructured meeting notes into useful information.
5. Assist users with research and information gathering.
6. Provide an interactive AI productivity assistant.
7. Promote responsible and human-supervised use of AI.

---

# Responsible AI Notice

Easy Note Taker uses artificial intelligence to generate, summarise and organise information.

AI-generated content may contain inaccurate, incomplete or misleading information.

Users should:

* Review AI-generated outputs.
* Verify important information using reliable sources.
* Avoid entering confidential or sensitive information.
* Apply human judgement before making important decisions.
* Treat AI as an assistant rather than an authoritative source.

---

# Academic Project

This application was developed as part of an academic project to demonstrate the practical application of artificial intelligence, prompt engineering, web application development and user-centred design.

The project focuses on demonstrating how multiple AI capabilities can be integrated into a single productivity application.

---

# License

This project was developed for academic and educational purposes.

© 2026 Easy Note Taker (ENT)
