import { render, screen } from "@testing-library/react";
import GrammarPage from "./GrammarPage";
import HelpPage from "./HelpPage";

jest.mock("../components/common/ContactForm", () => () => <form aria-label="contacto" />);

test("grammar page presents the coming soon roadmap", () => {
    render(<GrammarPage />);
    expect(screen.getByRole("heading", { name: "Gramática japonesa" })).toBeInTheDocument();
    expect(screen.getByText(/disponible próximamente/)).toBeInTheDocument();
});

test("help page presents instructions, FAQ and contact", () => {
    render(<HelpPage />);
    expect(screen.getByRole("heading", { name: "Cómo utilizar la aplicación" })).toBeInTheDocument();
    expect(screen.getByText("Q&A")).toBeInTheDocument();
    expect(screen.getByLabelText("contacto")).toBeInTheDocument();
});
