import { execFileSync, spawnSync } from "node:child_process";
import { constants, copyFileSync, existsSync, readdirSync, realpathSync } from "node:fs";
import { dirname, join } from "node:path";

const worktreeRoot = realpathSync(process.cwd());
const commonGitDirectory = execFileSync(
  "git",
  ["rev-parse", "--path-format=absolute", "--git-common-dir"],
  { encoding: "utf8" },
).trim();
const primaryRoot = dirname(commonGitDirectory);

const isLocalRootFile = (name) =>
  name === ".env" || name === ".env.local" || name === ".dev.vars" || name.startsWith(".dev.vars.");

const copyLocalRootFiles = () => {
  for (const entry of readdirSync(primaryRoot, { withFileTypes: true })) {
    if (!entry.isFile() || !isLocalRootFile(entry.name)) continue;

    const destination = join(worktreeRoot, entry.name);
    if (existsSync(destination)) continue;

    copyFileSync(join(primaryRoot, entry.name), destination, constants.COPYFILE_EXCL);
  }
};

if (worktreeRoot !== primaryRoot) {
  copyLocalRootFiles();
  console.log("Local environment files copied from the primary worktree.");
}

const install = spawnSync("bun", ["install", "--frozen-lockfile"], {
  cwd: worktreeRoot,
  stdio: "inherit",
});

if (install.error) throw install.error;
if (install.status !== 0) process.exit(install.status ?? 1);

// Apply migrations to this worktree’s own local D1 database.
const migrate = spawnSync("bun", ["run", "db:migrate"], {
  cwd: worktreeRoot,
  stdio: "inherit",
});

if (migrate.error) throw migrate.error;
process.exit(migrate.status ?? 1);
