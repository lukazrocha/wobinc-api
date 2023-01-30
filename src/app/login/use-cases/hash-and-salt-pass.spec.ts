import { HashAndSaltPass } from "./hash-and-salt-pass";
describe("Hash and Salt a Password", () => {
	it("should be able to compare successfully a hashed password", async () => {
		const password = "@this_is_a_password#";

		const hashedPassword = await HashAndSaltPass.hash(password);

		const result = await HashAndSaltPass.compare(password, hashedPassword);

		expect(result).toBe(true);
	});

	it("should not be able to compare successfully a hashed password", async () => {
		const password = "@this_is_a_password#";

		const hashedPassword = await HashAndSaltPass.hash(password);

		const result = await HashAndSaltPass.compare(
			"password",
			hashedPassword
		);

		expect(result).toBe(false);
	});
});
