import { CLIENT_PATH, TEMPLATES_PATH } from "../utils/index.js"
import type { ActionType, NodePlopAPI } from "plop"

export default (plop: NodePlopAPI) => {
	const { setGenerator } = plop

	setGenerator("single-component", {
		description: "Generate single file React component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Enter the component's name",
			},
			{
				type: "input",
				name: "tag",
				message: "Which HTML tag?",
				default: "div",
			},
			{
				type: "confirm",
				name: "export",
				message: "Export this component from components folder?",
				default: true,
			},
		],
		actions: data => {
			const actions: Array<ActionType> = [
				"Creating your new component",
				{
					type: "add",
					path: `${CLIENT_PATH}/components/{{ kebabCase name }}.tsx`,
					templateFile: `${TEMPLATES_PATH}/single-component.hbs`,
				},
			]

			if (data?.export)
				actions.push("Exporting your new component", {
					type: "modify",
					path: `${CLIENT_PATH}/components/index.ts`,
					template: 'export * from "./{{ kebabCase name }}"\n$1',
					pattern: /(\/\* Prepend export - DO NOT REMOVE \*\/)/g,
				})

			return actions
		},
	})
}
