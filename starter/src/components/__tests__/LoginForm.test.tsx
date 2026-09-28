// @vitest-environment happy-dom

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../LoginForm";

describe("LoginForm", () => {
	it("shows email, password and login button", () => {
		render(<LoginForm />);

		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Password")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Log in" })
		).toBeInTheDocument();
	});

	it("lets the user enter email and password", async () => {
		const user = userEvent.setup();

		render(<LoginForm />);

		const emailInput = screen.getByLabelText("Email");
		const passwordInput = screen.getByLabelText("Password");

		await user.type(emailInput, "test@example.com");
		await user.type(passwordInput, "password123");

		expect(emailInput).toHaveValue("test@example.com");
		expect(passwordInput).toHaveValue("password123");
	});
});