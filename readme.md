<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/6295/6295417.png" width="100" />
</p>
<p align="center">
    <h1 align="center">COSMIC CLASSROOM</h1>
</p>
<p align="center">
    <em>Explore the Universe from Your Screen</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/suprayoungblood/Cosmic-Classroom?style=flat&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/suprayoungblood/Cosmic-Classroom?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/suprayoungblood/Cosmic-Classroom?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/suprayoungblood/Cosmic-Classroom?style=flat&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
		<em>Developed with the software and tools below.</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
	<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
    <br>
	<img src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white" alt="Express">
	<img src="https://img.shields.io/badge/OpenAI-412991.svg?style=flat&logo=OpenAI&logoColor=white" alt="OpenAI">
	<img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=flat&logo=Tailwind-CSS&logoColor=white" alt="Tailwind CSS">
</p>

---

## 🚀 Quick Links

> - [Overview](#-overview)
> - [Features](#-features)
> - [Getting Started](#-getting-started)
>   - [Installation](#-installation)
>   - [Running Cosmic Classroom](#-running-cosmic-classroom)
> - [API Endpoints](#-api-endpoints)
> - [Contributing](#-contributing)
> - [License](#-license)
> - [Acknowledgments](#-acknowledgments)

---

## 🔭 Overview

Cosmic Classroom is an interactive space education application that leverages AI to answer questions about space, planets, galaxies, and more. It's designed to make learning about the cosmos engaging and accessible for users of all ages.

---

## ✨ Features

- AI-powered Q&A system for space-related topics
- React-based frontend for a responsive user interface
- Express.js backend integrated with OpenAI's GPT model
- Rate limiting to prevent API abuse
- Error handling for a smooth user experience

---

## 🛠 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### 📦 Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/suprayoungblood/Cosmic-Classroom.git
   cd Cosmic-Classroom
   ```

2. Install dependencies for both client and server:
   ```sh
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables:
   - In the server directory, create a `.env` file and add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_api_key_here
     PORT=3000
     ```

### 🚀 Running Cosmic Classroom

1. Start the server:
   ```sh
   cd server
   npm run dev
   ```
   The server will start on http://localhost:3000

2. In a new terminal, start the client development server:
   ```sh
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port Vite is running on).

---

## 📡 API Endpoints

The server provides the following endpoint:

- POST `/api/ask`: Send a question about space to get an AI-generated answer.
  - Request body: `{ "question": "Your space question here" }`
  - Response: `{ "answer": "AI-generated answer here" }`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👏 Acknowledgments

- OpenAI for providing the AI model
- The Vite and React teams for their excellent development tools

[**Return to Top**](#-quick-links)

---