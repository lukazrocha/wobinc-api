import * as bcrypt from "bcrypt";

export class HashAndSaltPass {
	static saltRounds: number = 10;

	static async hash(password: string) {
		const salt = await bcrypt.genSalt(this.saltRounds);
		const hash = await bcrypt.hash(password, salt);

		return hash;
	}

	static async compare(password: string, hashedPassword: string) {
		return await bcrypt.compare(password, hashedPassword);
	}
}
