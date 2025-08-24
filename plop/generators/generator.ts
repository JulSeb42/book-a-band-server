import type { ActionType, NodePlopAPI } from "plop"
import { toPascalCase } from "../utils"

export default (plop: NodePlopAPI) => {
	const { setGenerator } = plop

	setGenerator("generator", {
		description: "Generate plop generators",
		prompts: [
			{
				type: "input",
				message: "Enter the name of your new generator",
				name: "name",
			},
		],
		actions: data => {
			const actions: Array<ActionType> = [
				{
					type: "add",
					path: "./generators/{{>kebabName}}.ts",
					templateFile: "./templates/generator.hbs",
				},
				{
					type: "modify",
					path: "./generators/index.ts",
					template: `export { default as generate{{>pascalName}} } from "./{{>kebabName}}.js"\n$1`,
					pattern: /(\/\* Prepend export - DO NOT REMOVE \*\/)/g,
				},
				{
					type: "modify",
					path: "./plopfile.ts",
					template: `generate{{>pascalName}},\n\t$1`,
					pattern: /(\/\* Prepend import - DO NOT REMOVE \*\/)/g,
				},
				{
					type: "modify",
					path: "./plopfile.ts",
					template: `generate${toPascalCase(
						data?.name
					)}(plop) // pnpm plop:${data?.name[0]}\n\t$1`,
					pattern: /(\/\* Prepend generator - DO NOT REMOVE \*\/)/g,
				},
				"Don't forget to add the scripts in package.json :)",
			]

			return actions
		},
	})
}
