import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the KanaQuest app", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: /kanaquest/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /hiragana/i })).toBeInTheDocument();
});
