import { fireEvent, render, screen } from "@testing-library/react";
import Modal from "./Modal";
import Menu from "./Menu";
import GlobalSearch from "./GlobalSearch";
import Layout from "./Layout";
import KanaCard from "../kana/KanaCard";

jest.mock("../../hooks/useSupabaseAccount", () => ({
    useSupabaseAccount: () => ({
        displayName: "Ana",
        isConfigured: true,
        isLoading: false,
        isSignedIn: true,
        signOut: jest.fn(),
    }),
}));

test("Modal renders content and closes from both controls", () => {
    const onClose = jest.fn();
    render(<Modal title="Editar" onClose={onClose}><p>Contenido</p></Modal>);

    expect(screen.getByRole("dialog")).toHaveTextContent("Contenido");
    screen.getAllByRole("button", { name: "Cerrar" }).forEach(fireEvent.click);
    expect(onClose).toHaveBeenCalledTimes(2);
});

test("Menu renders sections, active state and navigation", () => {
    const onChange = jest.fn();
    render(<Menu isOpen activeSection="grammar" onChangeSection={onChange} />);

    const grammar = screen.getByRole("button", { name: "Gramática" });
    expect(grammar).toHaveClass("is-active");
    fireEvent.click(screen.getByRole("button", { name: "Vocabulario" }));
    expect(onChange).toHaveBeenCalledWith("vocabulary");
});

test("GlobalSearch opens, selects results, handles empty results and outside clicks", () => {
    const onChange = jest.fn();
    const onSelect = jest.fn();
    const { rerender } = render(
        <GlobalSearch
            value=""
            results={[]}
            onChange={onChange}
            onSelectResult={onSelect}
        />
    );

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "agua" } });
    expect(onChange).toHaveBeenCalledWith("agua");

    rerender(
        <GlobalSearch
            value="agua"
            results={[{ id: "1", section: "vocabulary", title: "水", subtitle: "mizu", meta: "Vocabulario" }]}
            onChange={onChange}
            onSelectResult={onSelect}
        />
    );
    fireEvent.focus(screen.getByRole("textbox"));
    fireEvent.click(screen.getByRole("button", { name: /水/ }));
    expect(onSelect).toHaveBeenCalledWith("vocabulary");

    rerender(<GlobalSearch value="missing" results={[]} onChange={onChange} onSelectResult={onSelect} />);
    fireEvent.focus(screen.getByRole("textbox"));
    expect(screen.getByText("No hay coincidencias.")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("No hay coincidencias.")).not.toBeInTheDocument();
});

test("Layout wires navigation controls and renders children", () => {
    const toggle = jest.fn();
    render(
        <Layout
            isMenuOpen
            currentSection="hiragana"
            searchTerm=""
            searchResults={[]}
            onToggleMenu={toggle}
            onChangeSection={jest.fn()}
            onChangeSearch={jest.fn()}
        >
            <p>Page body</p>
        </Layout>
    );

    expect(screen.getByText("Page body")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Abrir menu"));
    fireEvent.click(document.querySelector(".menu-backdrop") as Element);
    expect(toggle).toHaveBeenCalledTimes(2);
});

test("KanaCard renders kana information", () => {
    render(<KanaCard kana={{ id: "h-a", type: "hiragana", category: "basic", character: "あ", romaji: "a", group: "vowels" }} />);
    expect(screen.getByText("あ")).toBeInTheDocument();
    expect(screen.getByText("vowels")).toBeInTheDocument();
});
