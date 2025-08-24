import { CLIENT_PATH, SERVER_PATH, TEMPLATES_PATH } from "../utils/index.js"
import type { NodePlopAPI } from "plop"

export default (plop: NodePlopAPI) => {
	const { setGenerator } = plop

	setGenerator("route", {
		description: "Generate a new API route",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "Enter route's name",
				validate: input => {
					if (input[input.length - 1] === "s") {
						return "Name must be singular"
					}
					return true
				},
			},
		],
		actions: [
			"Creating a new type for your route",
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
			"Adding your new routes to server paths",
			{
				type: "modify",
				path: `${SERVER_PATH}/utils/server-paths.ts`,
				template: `{{ constantCase name }}: "/{{>kebabName}}",\n\t$1`,
				pattern: /(\/\* Prepend path root - DO NOT REMOVE \*\/)/g,
			},
			{
				type: "modify",
				path: `${SERVER_PATH}/utils/server-paths.ts`,
				template: `{{ constantCase name }}: {\n\t\tROOT: SERVER_PATH_ROOTS.{{ constantCase name }},\n\t\tALL_{{ constantCase name }}S: "/all-{{>kebabName}}s",\n\t\tGET_{{constantCase name}}: (id = ":id") => \`/{{>kebabName}}/\${id}\`,\n\t},\n\t$1`,
				pattern: /(\/\* Prepend server path - DO NOT REMOVE \*\/)/g,
			},
			"Creating your new route in server",
			{
				type: "add",
				path: `${SERVER_PATH}/routes/{{>kebabName}}.ts`,
				templateFile: `${TEMPLATES_PATH}/route.hbs`,
			},
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
			"Adding your new route to routes list",
			{
				type: "modify",
				path: `${SERVER_PATH}/routes/index.ts`,
				template:
					'import {{ camelCase name }} from "./{{>kebabName}}"\n$1',
				pattern:
					/(\/\* Prepend import new route - DO NOT REMOVE \*\/)/g,
			},
			{
				type: "modify",
				path: `${SERVER_PATH}/routes/index.ts`,
				template:
					"router.use(SERVER_PATHS.{{ constantCase name }}.ROOT, {{ camelCase name }})\n$1",
				pattern: /(\/\* Prepend router use - DO NOT REMOVE \*\/)/g,
			},
		],
	})
}
