import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Strip AI-generated title header from annotation content for clean copy.
 * Removes first line if it's a generic title like "Annotation médicale structurée".
 */
export function cleanAnnotationForCopy(content: string): string {
  const lines = content.split("\n");
  const firstLine = lines[0]?.replace(/^#+\s*/, "").trim().toLowerCase() || "";
  if (
    firstLine.includes("annotation médicale") ||
    firstLine.includes("annotation infirmière") ||
    firstLine.includes("annotation structurée")
  ) {
    // Remove the title line and any blank line right after it
    let start = 1;
    while (start < lines.length && lines[start].trim() === "") {
      start++;
    }
    return lines.slice(start).join("\n").trim();
  }
  return content;
}
