import fs from "node:fs";
import path from "node:path";
import type { PlannedFile, SkippedFile } from "./types.js";
import { resolveOutputFile } from "./pathUtils.js";

export interface WriteOptions {
  outputDirectory: string;
  force?: boolean;
  dryRun?: boolean;
}

export function writeFiles(files: PlannedFile[], options: WriteOptions): { written: PlannedFile[]; skipped: SkippedFile[] } {
  const written: PlannedFile[] = [];
  const skipped: SkippedFile[] = [];

  for (const file of files) {
    const target = resolveOutputFile(options.outputDirectory, file.path);
    if (!options.force && fs.existsSync(target)) {
      skipped.push({
        path: file.path,
        reason: "already exists",
        compatibleAgents: file.compatibleAgents
      });
      continue;
    }

    if (!options.dryRun) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, file.content, "utf8");
    }

    written.push(file);
  }

  return { written, skipped };
}
