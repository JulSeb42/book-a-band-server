import { CLIENT_PATH, TEMPLATES_PATH } from "../utils/index.js"
import type { ActionType, NodePlopAPI } from "plop"

export default (plop: NodePlopAPI) => {
	const { setGenerator } = plop

	setGenerator("component", {
		description: "React component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Enter component's name",
			},
			{
				type: "input",
				name: "tag",
				message: "Enter HTML tag",
				default: "div",
			},
			{
				type: "confirm",
				name: "ref",
				message: "Add ref?",
				default: false,
			},
			{
				type: "input",
				name: "attribute",
				message: "Enter HTML attribute",
				default: (data: { tag: string }) => data.tag,
				when: data => data.ref,
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
				"Creating new files",
				{
					type: "addMany",
					destination: `${CLIENT_PATH}/components/{{ kebabCase name }}`,
					templateFiles: `${TEMPLATES_PATH}/component/*.hbs`,
					base: `${TEMPLATES_PATH}/component`,
					verbose: false,
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
