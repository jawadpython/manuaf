# Contributing to Logistec

Thank you for your interest in contributing to Logistec! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/logistec.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Set up environment variables (see `.env.example`)
6. Initialize database: `npx prisma db push`

## Development Workflow

1. Make your changes
2. Test locally: `npm run dev`
3. Run linter: `npm run lint`
4. Commit your changes: `git commit -m "Description of changes"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Open a Pull Request

## Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Follow the existing code structure and patterns
- Run `npm run lint` before committing

## Commit Messages

Use clear, descriptive commit messages:

- `feat: Add new product filter feature`
- `fix: Resolve image upload issue`
- `docs: Update README with deployment instructions`
- `style: Format code with Prettier`
- `refactor: Simplify category filtering logic`

## Pull Request Process

1. Ensure your code follows the project's style guidelines
2. Update documentation if needed
3. Test your changes thoroughly
4. Describe your changes in the PR description
5. Reference any related issues

## Reporting Issues

When reporting issues, please include:

- Description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, etc.)

## Questions?

Feel free to open an issue for questions or discussions.

Thank you for contributing! 🎉
