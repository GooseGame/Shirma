export interface ProfileResponse {
    id: number,
    email: string,
    name: string,
    role: 0 | 1
}

export interface LoginResponse {
	accessToken: 	string,
	refreshToken: 	string,
	isNew:			boolean
}