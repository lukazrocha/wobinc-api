import { User } from "../users.entity";

export class UserViewModel {
	static toHTTP(user: User) {
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		};
	}
}
