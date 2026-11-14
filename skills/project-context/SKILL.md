---
name: project-context
description: Set up or maintain a `.project-context/` index for a workspace folder that holds many repos (a non-git parent folder such as ~/code/acme). Use when creating a project index for such a folder, adding, removing or renaming a project in it, writing down what changed after finishing work in one of its projects, or auditing it for size and stale content. Triggers include "project-context", "workspace index", "update the project context", "工作区索引", "记到 project context".
---

# project-context: context index for a multi-project workspace

Goal: when an agent enters a folder holding many repos, it reads one small index first, then only the one project file it needs, so the token cost does not grow with the number of projects.

Write the workspace files in the language the user works in; this skill only fixes the structure and the rules.

## Layout

```
<workspace>/
  README.md                    ← root index: one-paragraph intro + "read first" table + project table + shared rules
  .project-context/
    README.md                  ← maintenance rules (copied from templates/rules.md)
    <shared topic>.md          ← cross-project facts, e.g. architecture.md, machines.md
    <project>.md               ← single-file project
    <project>/README.md        ← main file of a split project, ending with a "sub-files" table
    <project>/<topic>.md
```

- One row per project in the root table: `` | `dir`, `long-lived worktree` | one short phrase | [link](.project-context/<project>.md) | ``. Keep the description to one phrase; repo URL and other details go in the project file.
- Worktrees get no file and no row of their own. List them at the top of the owning project's file.
- Every project file starts with: directory (main checkout branch, long-lived worktrees), repo and default branch, then one sentence on what it is.

## What to write

Treat it like memory: only what matters. Before writing anything, ask two questions: **Can it be checked on the spot? Will it change what someone does later?** Write it only if it cannot be checked on the spot and it changes future actions.

- Write: current state, rules, pitfalls, commands, rollback steps, secret variable names (never values), open to-dos and things still to verify.
- Don't write history: PR chains, which deploy was the first or second, results already verified, how a change came about. Git and PRs hold the history.
- Don't write what can be checked live: disk usage, sizes, durations, current image tags, container state, key ids. A duration is worth writing only when it decides how to work (e.g. "the full test suite takes 25 minutes; don't run it locally").
- Things outside git (manual server changes, backups, rollback points): rely on a naming convention instead of a log. Back up as `<file>.bak-<YYYYMMDD-HHMMSS>-<reason>` next to the original and don't list them. Only what cannot be judged on the spot (a rollback point still needed, a manual config that differs from the repo, something safe to clean up) goes into a "server notes" section, each entry saying what, where, why it is kept and when it can go; at most 5 entries per section.
- Each fact lives in one place; elsewhere, link to it.
- Delete to-do and to-verify entries once done. They must not turn into a diary.

## Size

- Root README ≤ 8192 bytes; every file in `.project-context/` ≤ 5120 bytes.
- When a project file is over the limit, first remove history and anything checkable live. If still over, turn it into a folder: `<project>/README.md` keeps the most used content and ends with a "sub-files" table saying when to read each `<project>/<topic>.md`. Don't create a links-only index file; it costs the agent an extra read.

## Setting up a workspace

1. List every directory in the workspace. Use `git -C <dir> rev-parse --path-format=absolute --git-common-dir` to tell standalone repos from worktrees. Read each repo's README / AGENTS.md, remote and default branch.
2. Ask the user about any directory you can't place (not a worktree, purpose unclear): include it, or is it obsolete?
3. Create `.project-context/` and copy [templates/rules.md](templates/rules.md) to `.project-context/README.md`, translated into the workspace's language.
4. Write one file per project. Put shared facts (servers, machines, licensing flows and the like) in shared files and list them in the root README's "read first" table.
5. Write the root README and end it with a line saying to read `.project-context/README.md` before editing these files.
6. Run the check script.
7. If there is a Claude memory directory for the workspace, add a reference memory: read the root README first, then `.project-context/<project>.md`.

## Day-to-day

- After finishing work in a project, ask the two questions above and update only that project's file with the conclusions; remove entries that are now stale or done.
- When a project is added, removed or renamed, update the root README's project table.
- Run the check script after editing.

## Check

```bash
node ~/.claude/skills/project-context/scripts/check.mjs <workspace dir>
```

It reports: files over the size limit, broken `.md` links, repos missing from the root index, and worktrees not mentioned in any project file. Fix what it prints; for size problems follow "Size" above.
