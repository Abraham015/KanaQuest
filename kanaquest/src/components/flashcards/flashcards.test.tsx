import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FolderGrid from "./FolderGrid";
import FolderSelector from "./FolderSelector";
import FlashcardList from "./FlashcardList";
import FlashcardSearch from "./FlashcardSearch";
import FolderForm from "./FolderForm";
import { CustomFlashcard, FlashcardFolder } from "../../types/flashcards";

const folder: FlashcardFolder = { id: "f1", type: "vocabulary", name: "N5", createdAt: "2026-01-01" };
const card: CustomFlashcard = { id: "c1", type: "vocabulary", folderId: "f1", front: "水", pronunciation: "mizu", meaning: "agua", createdAt: "2026-01-01" };

beforeAll(() => {
    Object.defineProperty(globalThis, "crypto", { value: { randomUUID: () => "uuid" } });
});

test("folder grid handles empty and populated states", () => {
    const select = jest.fn();
    const { rerender } = render(<FolderGrid folders={[]} cards={[]} emptyText="Sin carpetas" onSelectFolder={select} />);
    expect(screen.getByText("Sin carpetas")).toBeInTheDocument();
    rerender(<FolderGrid folders={[folder]} cards={[card]} emptyText="" onSelectFolder={select} />);
    fireEvent.click(screen.getByRole("button", { name: /N5/ }));
    expect(select).toHaveBeenCalledWith("f1");
});

test("folder selector and search report changes", () => {
    const change = jest.fn();
    const { rerender } = render(<FolderSelector folders={[folder]} selectedFolderId="all" onChange={change} totalCards={1} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "f1" } });
    expect(change).toHaveBeenCalledWith("f1");
    rerender(<FlashcardSearch value="" onChange={change} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "mizu" } });
    expect(change).toHaveBeenCalledWith("mizu");
});

test("flashcard list handles empty state and actions", () => {
    const edit = jest.fn();
    const remove = jest.fn();
    const { rerender } = render(<FlashcardList cards={[]} onEditCard={edit} onDeleteCard={remove} />);
    expect(screen.getByText(/No hay flashcards/)).toBeInTheDocument();
    rerender(<FlashcardList cards={[card]} onEditCard={edit} onDeleteCard={remove} />);
    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(edit).toHaveBeenCalledWith(card);
    expect(remove).toHaveBeenCalledWith("c1");
});

test("folder form validates, creates, edits and handles failures", async () => {
    const add = jest.fn();
    const saved = jest.fn();
    const { unmount } = render(<FolderForm folderType="vocabulary" onAddFolder={add} onSaved={saved} />);
    fireEvent.submit(screen.getByRole("button").closest("form")!);
    expect(add).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "  Verbos  " } });
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(add).toHaveBeenCalledWith(expect.objectContaining({ id: "uuid", name: "Verbos" })));
    expect(saved).toHaveBeenCalled();

    unmount();
    add.mockRejectedValueOnce(new Error("fail"));
    render(<FolderForm folderType="vocabulary" editingFolder={folder} onAddFolder={add} onSaved={saved} />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(add).toHaveBeenLastCalledWith(expect.objectContaining({ id: "f1" })));
});
