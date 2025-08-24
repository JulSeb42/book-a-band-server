import { slugify } from "./slugify";

export function toKebabCase(string: string): string {
	return slugify(string)
}