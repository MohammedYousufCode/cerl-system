# Git Workflow Commands

## Daily Development Workflow

### 1. Check current status
```bash
git status
```

### 2. Make changes to your code
- Edit files in your IDE
- Save your changes

### 3. Add changes to staging
```bash
# Add specific files
git add backend/views.py frontend/src/App.js

# Add all changes
git add .

# Add all modified files
git add -u
```

### 4. Commit with descriptive message
```bash
git commit -m "Fix login bug and update dashboard UI"
```

### 5. Push to GitHub
```bash
git push
```

## Common Scenarios

### Adding new files
```bash
git add new_file.py
git commit -m "Add new feature file"
git push
```

### Modifying existing files
```bash
git add modified_file.py
git commit -m "Update user authentication logic"
git push
```

### Multiple files changes
```bash
git add .
git commit -m "Implement user dashboard with map integration"
git push
```

## Checking Your Work

### View commit history
```bash
git log --oneline
```

### View recent changes
```bash
git diff
git diff --staged
```

### Pull latest changes from GitHub
```bash
git pull
```

## Pro Tips

### Good commit messages:
- "Fix: Resolve login authentication error"
- "Add: Implement user registration form"
- "Update: Improve dashboard performance"

### Bad commit messages:
- "fix"
- "stuff"
- "temp"

### Before pushing, always:
1. Check `git status`
2. Review your changes with `git diff`
3. Write clear commit messages
4. Pull latest changes: `git pull`
