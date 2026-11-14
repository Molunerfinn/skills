# skills

My personal agent skills for Claude Code (and any agent that reads `SKILL.md` skills).

## Skills

| Skill | What it does |
| --- | --- |
| [project-context](skills/project-context/SKILL.md) | Builds and maintains a small `.project-context/` index for a folder that holds many repos, so agents read only the project they need and token cost stays flat as projects grow. Includes a rules template and a check script. |

## Install

With [skills](https://skills.sh) (works for Claude Code, Codex, Cursor and other agents):

```bash
npx skills add Molunerfinn/skills -g                          # pick skills and agents interactively
npx skills add Molunerfinn/skills -g -s project-context -y    # install one skill without prompts
npx skills update -g                                          # pull the latest versions later
```

`-g` installs for your user; drop it to install into the current project.

### Development

To edit skills and see changes immediately, link from a local clone instead:

```bash
git clone git@github.com:Molunerfinn/skills.git ~/code/Molunerfinn/skills
~/code/Molunerfinn/skills/install.sh            # links into ~/.claude/skills
~/code/Molunerfinn/skills/install.sh <dir>      # or into another skills directory
```

`install.sh` symlinks each folder under `skills/` into the target directory, so edits and `git pull` take effect right away. Re-run it after adding a new skill. It never overwrites an existing non-symlink entry, so remove a skill installed by `npx skills` first (`npx skills remove -g <name>`).

## Adding a skill

1. Create `skills/<name>/SKILL.md` with `name` and `description` front matter; put helper files (`scripts/`, `templates/`, `references/`) next to it.
2. Write the skill in English.
3. Add a row to the table above.
4. Run `./install.sh`, and check that `npx skills add Molunerfinn/skills --list` finds it.
