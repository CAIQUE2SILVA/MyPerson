---
name: smart-commit
description: Review staged changes and generate accurate commit messages following project conventions. Use when the user asks to commit, create a commit, write a commit message, or review staged changes before committing.
disable-model-invocation: true
---

# Smart Commit

Generate commit messages by analyzing the actual diff — never invent or assume changes that are not in the staged files.

## Workflow

### Step 1: Gather context

Run these in parallel:

```bash
git status
git diff --cached
git log --oneline -5
```

If nothing is staged, warn the user and stop.

### Step 2: Analyze the diff

For every file in the diff, identify:

- What **actually changed** (added, removed, modified lines)
- The **intent** behind the change (new feature, fix, refactor, config, docs, chore)
- Whether the change is **complete** or looks like work-in-progress

Rules:
- Only describe what the diff shows. Never guess or add context not present in the code.
- If a change is ambiguous, describe it factually ("add X field to Y model") rather than interpreting intent.

### Step 3: Match the project pattern

Read the last 5 commits (`git log --oneline -5`) and detect:

- Language (English or Portuguese)
- Use of conventional commit prefixes (`feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `ci`)
- Scope usage (`feat(auth):` vs `feat:`)
- Capitalization (lowercase vs sentence case)
- Whether body/description is used

Adapt the new message to match.

### Step 4: Draft the message

Format:

```
<type>[optional scope]: <short summary in imperative mood>

[optional body — only if multiple logical changes need explanation]
```

Type reference:

| Type | When |
|------|------|
| `feat` | New functionality |
| `fix` | Bug fix |
| `refactor` | Code restructuring, no behavior change |
| `chore` | Build, deps, config, tooling |
| `docs` | Documentation only |
| `style` | Formatting, whitespace, linting |
| `test` | Adding or updating tests |
| `ci` | CI/CD pipeline changes |

Summary rules:
- Max 72 characters
- Imperative mood ("add", "fix", "remove" — not "added", "fixes", "removing")
- No period at the end
- Lowercase after the colon

Body rules (when needed):
- Blank line between summary and body
- Wrap at 72 characters
- Explain **what** and **why**, not **how**

### Step 5: Validate before committing

Checklist before running `git commit`:

- [ ] Message describes only changes present in the diff
- [ ] No invented or assumed changes
- [ ] Type prefix matches the nature of the change
- [ ] Language matches recent project commits
- [ ] Summary is ≤ 72 chars, imperative mood, no period
- [ ] If multiple unrelated changes are staged, suggest splitting into separate commits

### Step 6: Commit

Use a HEREDOC for the message to preserve formatting:

```bash
git commit -m "$(cat <<'EOF'
<type>: <summary>

<optional body>
EOF
)"
```

Then run `git status` to confirm success.

## Examples

**Single change:**
```
feat: add JWT authentication to API endpoints
```

**Multiple related changes:**
```
feat(auth): add JWT authentication and protect write endpoints

- Configure JwtBearer in Program.cs
- Add AuthController with login endpoint
- Add [Authorize] to POST/PUT/DELETE on ProdutosController
```

**Config/infra change:**
```
chore(docker): separate dev and prod compose files
```

**Fix:**
```
fix(cors): restrict allowed origins to explicit domain list
```

## Anti-patterns

- **Never** write "various improvements" or "update files" — be specific.
- **Never** describe changes that are not in the diff.
- **Never** combine unrelated changes without flagging it to the user.
- **Never** skip reading the diff. The diff is the source of truth.
