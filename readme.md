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
	<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black" alt="React">
	<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
    <br>
	<img src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white" alt="Express">
	<img src="https://img.shields.io/badge/OpenAI-412991.svg?style=flat&logo=OpenAI&logoColor=white" alt="OpenAI">
	<img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=flat&logo=Tailwind-CSS&logoColor=white" alt="Tailwind CSS">
    <br>
	<img src="https://img.shields.io/badge/Docker-2496ED.svg?style=flat&logo=Docker&logoColor=white" alt="Docker">
</p>

---

## 🚀 Quick Links

> - [Overview](#-overview)
> - [Features](#-features)
> - [Getting Started](#-getting-started)
>   - [Installation](#-installation)
>   - [Running Cosmic Classroom](#-running-cosmic-classroom)
>   - [Running Tests](#-running-tests)
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
- React-based frontend with Vite for fast development and building
- Express.js backend integrated with OpenAI's GPT model
- Rate limiting to prevent API abuse
- Error handling for a smooth user experience
- Responsive design using Tailwind CSS and Material Tailwind components
- Comprehensive test suite with Jest (server) and Vitest (client)
- Docker support for both development and testing
- CI/CD ready with GitHub Actions integration

---

## 🛠 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later) and npm (v6.0.0 or later)
- Docker and Docker Compose (for Docker setup)

### 📦 Installation

#### Option 1: Traditional Setup

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
   - In the root directory, create a `.env` file with all required variables:
     ```env
     # API Keys
     OPENAI_API_KEY=your_openai_api_key_here

     # Server Configuration
     PORT=3000
     NODE_ENV=development

     # Database Configuration
     DB_HOST=localhost
     DB_NAME=cosmic_classroom
     DB_USER=postgres
     DB_PASSWORD=postgres
     DB_PORT=5432

     # JWT Configuration
     JWT_SECRET=your_secure_random_jwt_secret_here

     # Client Configuration (for Docker)
     VITE_API_URL=http://localhost:3000/api
     ```

### 🚀 Running Cosmic Classroom

#### Option 1: Traditional Setup

1. Start the server:
   ```sh
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:3000`

2. In a new terminal, start the client development server:
   ```sh
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port Vite is running on).

#### Option 2: Docker Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/suprayoungblood/Cosmic-Classroom.git
   cd Cosmic-Classroom
   ```

2. Create a `.env` file in the root directory (use the same configuration as shown above in the Installation section)

3. Build and start the Docker containers:
   ```sh
   docker-compose up --build
   ```

4. Open your browser and navigate to `http://localhost:5173` for the client and `http://localhost:3000` for the server.

### 🧪 Running Tests

The project includes comprehensive test suites for both the client (React) and server (Node.js) applications.

#### Test Stack
- **Server**: Jest + Supertest for API testing
- **Client**: Vitest + React Testing Library + MSW for component and integration testing
- **Coverage**: Minimum 70% coverage thresholds enforced

#### Using Docker (Recommended)

We provide several ways to run tests with Docker:

##### Using Make commands (easiest):
```sh
# Run all tests
make test

# Run server tests only
make test-server

# Run client tests only
make test-client

# Run tests in watch mode
make test-watch

# Run tests with coverage reports
make test-coverage

# Open Vitest UI for client tests
make test-ui

# Clean up test containers
make test-clean
```

##### Using docker-compose directly:
```sh
# Run all tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit server-test client-test

# Run server tests only
docker-compose -f docker-compose.test.yml up --abort-on-container-exit server-test

# Run client tests only
docker-compose -f docker-compose.test.yml up --abort-on-container-exit client-test

# Clean up test containers
docker-compose -f docker-compose.test.yml down
```

##### Using the test script:
```sh
# Make the script executable (first time only)
chmod +x scripts/docker-test.sh

# Run all tests
./scripts/docker-test.sh all

# Run server tests
./scripts/docker-test.sh server

# Run client tests
./scripts/docker-test.sh client

# Run tests in watch mode
./scripts/docker-test.sh server:watch
./scripts/docker-test.sh client:watch

# Run with coverage
./scripts/docker-test.sh server:coverage
./scripts/docker-test.sh client:coverage
```

#### Running Tests Locally

If you prefer to run tests without Docker:

##### Server tests:
```sh
cd server
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
npm run test:unit       # Unit tests only
npm run test:integration # Integration tests only
```

##### Client tests:
```sh
cd client
npm test                # Run all tests
npm run test:ui         # Open Vitest UI
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage
```

### 📊 Test Coverage

Both server and client have coverage thresholds set to 70% for:
- Branches
- Functions  
- Lines
- Statements

Coverage reports are generated in:
- `./server/coverage` for server tests
- `./client/coverage` for client tests

You can view detailed HTML coverage reports by opening:
- `./server/coverage/lcov-report/index.html`
- `./client/coverage/index.html`

### 🔧 Test Configuration

Test configurations can be found in:
- `server/jest.config.js` - Server test configuration
- `client/vite.config.js` - Client test configuration (integrated with Vite)
- `docker-compose.test.yml` - Docker test environment setup

### 🚦 CI/CD Integration

The project includes GitHub Actions workflows for automated testing:
- Tests run automatically on pull requests
- Coverage reports are generated and can be integrated with services like Codecov
- Tests must pass before merging to main branch

---

## 📡 API Endpoints

The server provides the following endpoints:

### Authentication
- POST `/api/auth/register`: Register a new user
- POST `/api/auth/login`: Login a user
- GET `/api/auth/profile`: Get user profile (requires authentication)
- PUT `/api/auth/profile`: Update user profile (requires authentication)

### Questions
- POST `/api/questions/ask`: Ask a question (public endpoint)
- POST `/api/questions/ask-authenticated`: Ask a question as authenticated user (earns XP)
- GET `/api/questions/history`: Get user's question history (requires authentication)

### Game Mechanics
- GET `/api/game/profile`: Get user's game profile (level, XP, badges)
- PUT `/api/game/streak`: Update daily streak
- POST `/api/game/xp`: Award XP for activities

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Workflow
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Write tests for your changes
4. Run tests locally (`make test`)
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Code Standards
- Write tests for all new features
- Maintain minimum 70% test coverage
- Follow existing code style and conventions
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👏 Acknowledgments

- OpenAI for providing the AI model
- The Vite and React teams for their excellent development tools
- Material Tailwind for the UI components

[**Return to Top**](#-quick-links)

---