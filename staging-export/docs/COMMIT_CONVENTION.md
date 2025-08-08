
# Commit Message Convention

We follow a simplified version of [Conventional Commits](https://www.conventionalcommits.org/) for our commit messages. This helps to maintain a clear and organized git history.

## Format

Each commit message consists of a **header**, an optional **body**, and an optional **footer**.

```
<type>: <subject>

[optional body]

[optional footer]
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

## Examples

```
feat: add user profile photo upload
```

```
fix: prevent infinite loading state in dashboard

The dashboard would sometimes get stuck in a loading state when the API
returns an empty response. This fixes the issue by adding a timeout.

Closes #123
```

```
docs: update README with deployment instructions
```

```
style: format code with prettier
```

```
refactor: simplify authentication flow
```

## Tips

1. Use the present tense ("add feature" not "added feature")
2. Use the imperative mood ("move cursor to..." not "moves cursor to...")
3. Limit the first line to 72 characters or less
4. Reference issues and pull requests liberally after the first line
5. When only changing documentation, include `[ci skip]` in the commit title
6. Consider starting the commit message with an applicable emoji:
   - ✨ `:sparkles:` when adding a new feature
   - 🐛 `:bug:` when fixing a bug
   - 📚 `:books:` when adding or updating documentation
   - ♻️ `:recycle:` when refactoring code
   - 🎨 `:art:` when improving the format/structure of the code
   - ⚡️ `:zap:` when improving performance
   - 🔧 `:wrench:` when updating configuration files
   - ✅ `:white_check_mark:` when adding tests
