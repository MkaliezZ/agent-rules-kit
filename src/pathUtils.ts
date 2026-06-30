import path from "node:path";

export function normalizeOutputPath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

export function resolveOutputDirectory(outputDirectory = "."): string {
  return path.resolve(outputDirectory);
}

export function resolveOutputFile(outputDirectory: string, relativePath: string): string {
  return path.join(outputDirectory, relativePath);
}
