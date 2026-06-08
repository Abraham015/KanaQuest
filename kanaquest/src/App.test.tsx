import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("sweetalert2", () => ({
    __esModule: true,
    default: { fire: jest.fn() },
}));

test("renders the KanaQuest app", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /kanaquest/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /hiragana/i })).toBeInTheDocument();
});
