import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ContactForm from "./ContactForm";

jest.mock("../../hooks/useSupabaseAccount", () => ({
    useSupabaseAccount: () => ({ displayName: "Ana", email: "ana@example.com" }),
}));

afterEach(() => jest.restoreAllMocks());

function fillForm() {
    fireEvent.change(screen.getByLabelText("Asunto"), { target: { value: "Ayuda" } });
    fireEvent.change(screen.getByLabelText("Mensaje"), { target: { value: "Necesito ayuda con vocabulario" } });
}

test("contact form sends and clears a valid message", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ message: "ok" }),
    } as Response);
    render(<ContactForm />);
    expect(screen.getByLabelText("Nombre")).toHaveValue("Ana");
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    await screen.findByText(/Mensaje enviado/);
    expect(global.fetch).toHaveBeenCalledWith("/.netlify/functions/contact", expect.objectContaining({ method: "POST" }));
    expect(screen.getByLabelText("Asunto")).toHaveValue("");
});

test("contact form reports API and network errors", async () => {
    const fetchMock = jest.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Servicio no disponible" }),
    } as Response);
    const { rerender } = render(<ContactForm />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    await screen.findByText("Servicio no disponible");

    fetchMock.mockRejectedValueOnce("network");
    rerender(<ContactForm />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    await waitFor(() => expect(screen.getByText("No se pudo enviar el mensaje.")).toBeInTheDocument());
});
