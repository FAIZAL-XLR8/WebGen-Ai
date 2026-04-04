# WebGen AI

WebGen AI is a full-stack, AI-powered platform that allows users to seamlessly generate, edit, and preview website code. By leveraging the power of advanced language models (via OpenRouter), it provides an intuitive interface for creating custom web applications from text prompts. 

The application is built with a modern MERN-like stack (MongoDB, Express, React, Node.js) with powerful UI tooling and robust backend handling for user authentication, AI generations, and token/credit management (via Stripe).

## Features

- **AI Website Generation**: Generate full websites or specialized components using cutting-edge AI models powered by OpenRouter.
- **Interactive Code Editor**: View and modify the AI-generated code instantly using the deeply integrated Monaco Editor.
- **Live Previewing**: See real-time previews of the generated web elements.
- **Secure Authentication**: Google OAuth flow and session management utilizing Firebase on the frontend, Passport.js, and JWT on the backend.
- **Credit & Payment System**: Integrated with Stripe to handle seamless credit purchases and generation deductions.
- **Smooth & Responsive UI**: Built precisely with Tailwind CSS and Framer Motion for premium aesthetics and fluid interactions.

## Tech Stack

### Frontend (Client)
- **Framework**: React.js (Vite)
- **State Management**: Redux Toolkit (`react-redux`)
- **Styling**: Tailwind CSS, Framer Motion (for dynamic UI animations)
- **Routing**: React Router DOM
- **Editor Integration**: Monaco Editor (`@monaco-editor/react`)
- **Icons**: Lucide React
- **Auth (Client-facing)**: Firebase

### Backend (Server)
- **Runtime & Web Framework**: Node.js with Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: Passport.js (Google OAuth 2.0), JSON Web Tokens (JWT)
- **Payments**: Stripe Checkout and Webhooks
- **External APIs**: OpenRouter (via Axios) for multi-model AI routing

## Project Structure

```
WebGen-Ai/
├── client/                 # React frontend application
│   ├── public/             # Static assets
│   ├── src/                # Front-end React logic, components, and pages
│   ├── vite.config.js      # Vite configuration
│   └── package.json        
├── server/                 # Express backend application
│   ├── config/             # DB and API configuration
│   ├── controllers/        # Handlers for processing incoming requests
│   ├── middlewares/        # Authentication, Validation, and Error Handling
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # API endpoint definitions
│   ├── index.js            # Server entry point
│   └── package.json        
└── package.json            # Root level configuration
```

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your machine. You will also need a MongoDB URI, API keys from OpenRouter, Google OAuth credentials, and Stripe secret keys.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/FAIZAL-XLR8/WebGen-Ai.git
   cd WebGen-Ai
   ```

2. **Setup the server:**
   ```bash
   cd server
   npm install
   ```
   *Create a `.env` file inside the `server/` directory. You will need to add your MongoDB URI, Google OAuth client info, JWT secret, Stripe keys, and OpenRouter API keys.*

3. **Setup the client:**
   ```bash
   cd ../client
   npm install
   ```
   *Create a `.env` file inside the `client/` directory for Vite specific environment variables (like your API base URL, Firebase config).*

### Running the Application Locally

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```
   *This uses nodemon to run the backend API automatically on a local port.*

2. **Start the frontend development server:**
   ```bash
   cd client
   npm run dev
   ```

Now open your browser and navigate to the local link provided by Vite (usually `http://localhost:5173`) to see the application!

## License
This project is licensed under the ISC License.
