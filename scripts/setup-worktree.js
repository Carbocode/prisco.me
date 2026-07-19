import { execFileSync, spawnSync } from "node:child_process";
import { constants, copyFileSync, cpSync, existsSync, readdirSync, realpathSync } from "node:fs";
import { dirname, join } from "node:path";

const worktreeRoot = realpathSync(process.cwd());
const commonGitDirectory = execFileSync(
  "git",
  ["rev-parse", "--path-format=absolute", "--git-common-dir"],
  { encoding: "utf8" },
).trim();
const primaryRoot = dirname(commonGitDirectory);

const isLocalRootFile = (name) =>
  name === ".env" ||
  name.startsWith(".env.") ||
  name.startsWith(".dev.vars") ||
  name.endsWith(".local") ||
  name === "count.txt" ||
  name === "todos.json";

const copyLocalRootFiles = () => {
  for (const entry of readdirSync(primaryRoot, { withFileTypes: true })) {
    if (!entry.isFile() || !isLocalRootFile(entry.name)) continue;

    const destination = join(worktreeRoot, entry.name);
    if (existsSync(destination)) continue;

    copyFileSync(join(primaryRoot, entry.name), destination, constants.COPYFILE_EXCL);
  }
};

const copyWranglerState = () => {
  const source = join(primaryRoot, ".wrangler", "state");
  if (!existsSync(source)) return;

  cpSync(source, join(worktreeRoot, ".wrangler", "state"), {
    recursive: true,
    force: false,
    errorOnExist: false,
    preserveTimestamps: true,
    filter: (path) => !path.endsWith(".DS_Store"),
  });
};

if (worktreeRoot !== primaryRoot) {
  copyLocalRootFiles();
  copyWranglerState();
  console.log("Configurazione locale e stato Wrangler copiati dal worktree principale.");
}

const install = spawnSync("bun", ["install"], { cwd: worktreeRoot, stdio: "inherit" });

if (install.error) throw install.error;
process.exit(install.status ?? 1);
