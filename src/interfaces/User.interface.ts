export interface ProfileResponse {
    id: number,
    email: string,
    name: string
}

export interface LoginResponse {
	accessToken: 	string,
	refreshToken: 	string,
	isNew:			boolean
}