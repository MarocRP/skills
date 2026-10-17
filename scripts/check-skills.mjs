#!/usr/bin/env node
// Checks every skill under skills/ the way a harness loads it.
// Exits 1 and lists every problem if any skill would be skipped or is out of sync with the manifest.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const problems = [];

function findSkills(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (!entry.isDirectory()) return [];
    return existsSync(join(path, "SKILL.md")) ? [path] : findSkills(path);
  });
}

function readYaml(file, source) {
  try {
    return parse(source);
  } catch (error) {
    problems.push(`${file}: YAML parse error: ${error.message.split("\n")[0]}`);
  }
}

const skills = findSkills(join(repo, "skills"));

for (const dir of skills) {
  const rel = relative(repo, dir).replaceAll("\\", "/");
  const [, bucket, folder] = rel.split("/");
  const skillFile = `${rel}/SKILL.md`;
  const frontmatter = readFileSync(join(dir, "SKILL.md"), "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!frontmatter) {
    problems.push(`${skillFile}: no frontmatter`);
    continue;
  }

  const meta = readYaml(skillFile, frontmatter[1]);
  if (!meta) continue;

  if (meta.name !== folder) problems.push(`${skillFile}: name is "${meta.name}", folder is "${folder}"`);
  if (typeof meta.description !== "string" || !meta.description.trim()) {
    problems.push(`${skillFile}: description is missing or not a string`);
  }

  const openaiFile = `${rel}/agents/openai.yaml`;
  if (!existsSync(join(repo, openaiFile))) {
    problems.push(`${openaiFile}: missing`);
  } else {
    const openai = readYaml(openaiFile, readFileSync(join(repo, openaiFile), "utf8"));
    if (openai) {
      const userInvoked = meta["disable-model-invocation"] === true;
      const noImplicit = openai.policy?.allow_implicit_invocation === false;
      if (userInvoked !== noImplicit) {
        problems.push(
          `${rel}: disable-model-invocation and policy.allow_implicit_invocation disagree (see .agents/invocation.md)`,
        );
      }
    }
  }

  if (!existsSync(join(repo, "docs", bucket, `${folder}.md`))) {
    problems.push(`docs/${bucket}/${folder}.md: missing`);
  }
}

const listed = JSON.parse(readFileSync(join(repo, ".claude-plugin", "plugin.json"), "utf8")).skills.map((path) =>
  path.replace(/^\.\//, ""),
);
const found = skills.map((dir) => relative(repo, dir).replaceAll("\\", "/"));

for (const path of found) {
  if (!listed.includes(path)) problems.push(`.claude-plugin/plugin.json: ${path} is not in skills`);
}
for (const path of listed) {
  if (!found.includes(path)) problems.push(`.claude-plugin/plugin.json: ${path} has no SKILL.md`);
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(`${skills.length} skills OK`);
