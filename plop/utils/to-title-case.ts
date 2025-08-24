import { toBaseCase } from "./to-base-case"

export function toTitleCase(string: string): string {
	const formattedString = toBaseCase(string)

	const arr = formattedString.toLowerCase().split(" ")

	for (var i = 0; i < arr.length; i++) {
		arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
	}

	return arr.join(" ")
}
