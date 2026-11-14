# .project-context maintenance rules

Read this before editing anything under `.project-context/` or the root README. The full guide is the `project-context` skill.

- Treat it like memory: only what matters. Before writing, ask: **Can it be checked on the spot? Will it change what someone does later?** Write it only if it can't be checked on the spot and it changes future actions.
- Write only current state, rules and how-tos. No history: PR chains, which deploy was which, results already verified, how a change came about. Git and PRs hold the history.
- Don't write what can be checked live: disk usage, sizes, durations, current image tags, container state, key ids. Check them when needed.
- Size: root README ≤ 8192 bytes, every file ≤ 5120 bytes (check with `wc -c`).
- A single-file project is `<project>.md`. When it has to be split, it becomes a folder: `<project>/README.md` is the main file (most used content, ending with a "sub-files" table saying when to read each file), details go in `<project>/<topic>.md`, and the root README's project table links to `<project>/README.md`.
- Each fact lives in one place; elsewhere, link to it.
- Unfinished work goes in a "to-do" section and is deleted once done.
- When a project's facts change, edit only its file. When a project is added, removed or renamed, update the root README's project table. Worktrees get no file of their own; they go in the owning project's file.

## Information outside git

Manual server changes, backups and rollback points never reach git:

- A naming convention replaces a log: before changing a server config, back it up as `<file>.bak-<YYYYMMDD-HHMMSS>-<reason>` next to the original. Find them with `ls *.bak-*` when needed; don't list them here.
- Only what can't be judged on the spot goes into the relevant file's "server notes" section: a rollback point still needed, a manual config that differs from the repo, something safe to clean up. Each entry says what it is, where, why it is kept and when it can be deleted.
- Delete an entry once it no longer matters (deleted, expired, or synced into the repo). At most 5 entries per section; when full, clean up the server or drop the least important entry.
- Facts shared by a whole server or several projects go in a shared file (such as `architecture.md`); facts about one project go in that project's file.
