import {
	CLIENT_PATH,
	TEMPLATES_PATH,
	SERVER_PATH,
	SHARED_PATH,
} from "../utils/index.js"
import type { NodePlopAPI, ActionType } from "plop"

export default (plop: NodePlopAPI) => {
	const { setGenerator } = plop

	setGenerator("type", {
		description: "Create a TS type",
		prompts: [
			{ type: "input", name: "name", message: "Enter type's name" },
		],
		actions: data => {
			const actions: Array<ActionType> = []

			const PATH = SERVER_PATH

			if (data?.interface) {
				actions.push(
					"Creating your new interface",
					{
						type: "add",
						path: `${PATH}/types/{{>pascalName}}.interface.ts`,
						templateFile: `${TEMPLATES_PATH}/interface.hbs`,
					},
					"Exporting your new interface",
					{
						type: "modify",
						path: `${PATH}/types/index.ts`,
						template: `export * from "./{{>pascalName}}.interface"\n$1`,
						pattern: /(\/\* Prepend export - DO NOT REMOVE \*\/)/g,
					}
				)
			} else {
				actions.push(
					"Creating your new type",
					{
						type: "add",
						path: `${PATH}/types/{{>pascalName}}.type.ts`,
						templateFile: `${TEMPLATES_PATH}/type.hbs`,
					},
					"Exporting your new type",
					{
						type: "modify",
						path: `${PATH}/types/index.ts`,
						template: `export * from "./{{>pascalName}}.type"\n$1`,
						pattern: /(\/\* Prepend export - DO NOT REMOVE \*\/)/g,
					}
				)
			}

			return actions
		},
	})
}
