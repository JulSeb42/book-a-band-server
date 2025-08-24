import { CLIENT_PATH, TEMPLATES_PATH } from "../utils/index.js"
import type { NodePlopAPI } from "plop"

export default (plop: NodePlopAPI) => {
	const { setGenerator } = plop

	setGenerator("context", {
		description: "Creates React context",
		prompts: [
			{ type: "input", name: "name", message: "Enter context's name" },
		],
		actions: [
			{
				type: "addMany",
				destination: `${CLIENT_PATH}/context/{{>kebabName}}`,
				templateFiles: `${TEMPLATES_PATH}/context/*.hbs`,
				base: `${TEMPLATES_PATH}/context`,
				verbose: false,
			},
			{
				type: "modify",
				path: `${CLIENT_PATH}/context/index.ts`,
				template: `export * from "./{{>kebabName}}"\n$1`,
				pattern: /(\/\* Prepend export - DO NOT REMOVE \*\/)/g,
			},
			{
				type: "modify",
				path: `${CLIENT_PATH}/routes/__root.tsx`,
				template: `{{>pascalName}}ProviderWrapper,\n\t$1`,
				pattern: /(\/\* Prepend context import - DO NOT REMOVE \*\/)/g,
			},
			"Don't forget to add the provider in your routes/_root.tsx :)",
		],
	})
}
