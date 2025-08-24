export const userRoles = {
	user: "user",
	artist: "artist",
	admin: "admin",
} as const

export type UserRole = keyof typeof userRoles

export const sortArtists = {
	price: "price",
	availability: "availability",
} as const

export type SortArtist = keyof typeof sortArtists | undefined

export type User = {
	_id: string
	fullName: string
	email: string
	password: string
	verified: boolean
	verifyToken: string
	resetToken: string
	avatar: string
	city: string
	role: UserRole
	genre: string
	bio: string
	price: number
	available: Array<string>
	youtubeUrl: string
	facebookUrl: string
	instagramUrl: string
	youtubeLinks: Array<string>
	slug: string
	approved: boolean
}
