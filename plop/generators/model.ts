import {
	SERVER_PATH,
	TEMPLATES_PATH,
	SHARED_PATH,
	CLIENT_PATH,
} from "../utils/index.js"
import type { NodePlopAPI, ActionType } from "plop"

export default (plop: NodePlopAPI) => {
	const { setGenerator } = plop

	setGenerator("model", {
		description: "",
		prompts: [
			{ type: "input", message: "Enter model's name", name: "name" },
			{
				type: "confirm",
				message: "Create a new type for your model?",
				name: "type",
				default: true,
			},
		],
		// actions: [

		// ],
		actions: data => {
			const actions: Array<ActionType> = [
				"Creating a new Mongoose model",
				{
					type: "add",
					path: `${SERVER_PATH}/models/{{>pascalName}}.model.ts`,
					templateFile: `${TEMPLATES_PATH}/model.hbs`,
				},
				{
					type: "modify",
					path: `${SERVER_PATH}/models/index.ts`,
					template: 'export * from "./{{>pascalName}}.model"\n$1',
					pattern: /(\/\* Prepend new model - DO NOT REMOVE \*\/)/g,
				},
			]

			if (data?.type === true) {
				actions.push(
					"Creating a new type for your model",
					{
						type: "add",
						path: `${SERVER_PATH}/types/{{>pascalName}}.type.ts`,
						templateFile: `${TEMPLATES_PATH}/type.hbs`,
					},
					{
						type: "modify",
						path: `${SERVER_PATH}/types/index.ts`,
						template: `export * from "./{{>pascalName}}.type"\n$1`,
						pattern: /(\/\* Prepend export - DO NOT REMOVE \*\/)/g,
					},
				)
			}

			return actions
		},
	})
}
