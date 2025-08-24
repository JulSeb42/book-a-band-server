export function toBaseCase(string: string): string {
	let splitted = string
		.split(/\.?(?=[A-Z])/)
		.join(" ")
		.toLowerCase()

	const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;-"
	const to = "aaaaeeeeiiiioooouuuunc-- --- "
	for (let i = 0, l = from.length; i < l; i++) {
		splitted = splitted.replace(
			new RegExp(from.charAt(i), "g"),
			to.charAt(i)
		)
	}

	return splitted
}
