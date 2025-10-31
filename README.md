# 🍳 Golden Whisk Pro - Interactive PostgreSQL Learning Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

> An interactive, gamified platform for learning PostgreSQL through hands-on practice with immediate feedback and progressive hints.

## ✨ Features

- **17 Progressive Modules** - From database basics to advanced queries
- **Interactive SQL Editor** - Monaco editor with syntax highlighting
- **Three-Level Hint System** - Concept → Example → Full Answer
- **Real-time Validation** - Instant feedback on SQL queries
- **Achievement System** - Unlock badges as you progress
- **Sandbox Environment** - Safe, isolated practice databases
- **Beautiful UI** - Modern dark theme with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+ or Docker
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/koriyoshi2041/LearnPostgreSQL.git
cd LearnPostgreSQL

# Setup with Docker (recommended)
docker-compose up -d

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start backend (new terminal)
cd backend && npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev
```

Visit **http://localhost:3000** to start learning!

## 📚 Learning Path

### Beginner
- Database creation and extensions
- Table structure and data types
- Constraints and integrity

### Intermediate
- Foreign keys and relationships
- JSONB for flexible data
- Transactions and conflict handling

### Advanced
- Complex queries and JOINs
- Window functions
- Performance optimization with indexes

## 🎯 Usage

1. Select a module from the sidebar
2. Read the task description
3. Write SQL in the Monaco editor
4. Click **Run** to test or **Submit** to validate
5. Use hints if needed (three levels of assistance)

## 🏆 Achievements

- **First Table Master** - Create your first table
- **Relationship Architect** - Set up foreign keys
- **JSON Wizard** - Master JSONB queries
- **Transaction Pro** - Complete a transaction
- **Performance Guru** - Create an index
- **Grand Chef** - Complete all modules

## 🛠️ Tech Stack

**Frontend:** React 18 · TypeScript · Vite · TailwindCSS · Monaco Editor · Zustand

**Backend:** Node.js · Express · TypeScript · PostgreSQL · Docker

## 📖 Documentation

- [Quick Start Guide](QUICK_START.md)
- [Getting Started](GETTING_STARTED.md)
- [Project Summary](PROJECT_SUMMARY.md)

## 🔒 Security

- SQL injection prevention
- Dangerous command blocking
- Query timeout protection
- Rate limiting
- Sandbox isolation per user

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

- GitHub: [@koriyoshi2041](https://github.com/koriyoshi2041)
- Repository: [LearnPostgreSQL](https://github.com/koriyoshi2041/LearnPostgreSQL)

## 🙏 Acknowledgments

Built with ❤️ for PostgreSQL learners worldwide.

---

**Start your PostgreSQL journey today! 🎓👨‍🍳**
