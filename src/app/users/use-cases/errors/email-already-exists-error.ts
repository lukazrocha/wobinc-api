export class EmailAlreadyExists extends Error {
	constructor(message: string) {
		super(message);
	}
}
