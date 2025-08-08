
# Contributing to Unimog Community Hub

Thank you for your interest in contributing to the Unimog Community Hub! This guide will help you get started with the development process and ensure your contributions align with the project's standards.

## Development Setup

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd unimog-community-hub
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Start the development server**
   ```
   npm run dev
   ```

4. **Build for production**
   ```
   npm run build
   ```

## Pull Request Process

1. **Create a feature branch**
   ```
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit them**
   ```
   git add .
   git commit -m "Add your meaningful commit message here"
   ```

3. **Push your branch**
   ```
   git push origin feature/your-feature-name
   ```

4. **Create a pull request on GitHub**
   - Navigate to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch and provide a detailed description of your changes

5. **Address review comments**
   - Make requested changes
   - Push additional commits to your branch
   - The PR will update automatically

## Code Style and Standards

- Follow the [Style Guide](./STYLE_GUIDE.md) for code formatting and standards
- Run linting before submitting your PR: `npm run lint`
- Ensure your code passes all tests: `npm test`

## Commit Message Guidelines

We follow a simplified version of Conventional Commits:

```
feat: add new feature
fix: fix a bug
docs: update documentation
style: formatting changes
refactor: code changes that neither fix bugs nor add features
perf: performance improvements
test: add or modify tests
chore: changes to build process or auxiliary tools
```

## Branch Naming Convention

- `feature/` - for new features
- `fix/` - for bug fixes
- `docs/` - for documentation changes
- `refactor/` - for refactoring existing code

## Creating Issues

When creating a new issue, please include:

1. **Clear title** - summarize the issue concisely
2. **Detailed description** - explain the problem or feature request
3. **Steps to reproduce** - for bug reports
4. **Expected behavior** - what should happen
5. **Screenshots** - if applicable
6. **Environment details** - browser, OS, etc.

## License

By contributing to this project, you agree that your contributions will be licensed under the project's license.
