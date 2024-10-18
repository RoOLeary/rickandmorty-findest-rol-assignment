/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-console */
import { execSync } from "node:child_process";
import { unlinkSync } from "node:fs";
import { join } from "node:path";
import { chdir, exit } from "node:process";

// eslint-disable-next-line no-undef
const rootDir = join(__dirname, "..");

function removeTailwind() {
  try {
    unlinkSync(rootDir + "/postcss.config.js");
    console.log("remove postcss.config.js");
    unlinkSync(rootDir + "/tailwind.config.mjs");
    console.log("remove tailwind.config.mjs");
  } catch (e) {
    if (e.message.includes("no such file or directory"))
      console.log(
        "postcss.config.js/tailwind.config.mjs has already been removed.",
      );
  }

  // npm unlinstall
  const packageJson = rootDir + "/package.json";

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  const tailwindPackages = [];

  for (const dep in dependencies) {
    if (dep.includes("tailwindcss")) {
      tailwindPackages.push(dep);
    }
  }

  for (const dep in devDependencies) {
    if (dep.includes("tailwindcss")) {
      tailwindPackages.push(dep);
    }
  }

  if (tailwindPackages.length === 1) {
    console.log("TailwindCSS has already been removed.\n");
    exit();
  }

  const uninstallCommand = "npm uninstall " + tailwindPackages.join(" ");

  chdir(rootDir);
  // execSync return null when command successful
  const res = execSync(uninstallCommand, {
    stdio: [0, 1, 2],
  });

  if (res !== null && res.status !== 0)
    console.error("Command Failed: " + uninstallCommand);

  console.log(tailwindPackages.join("\n"));
  console.log("Above packages uninstall has been successful.");
  console.log();
  console.log("Completed remove TailwindCSS.");
}

// run
removeTailwind();
