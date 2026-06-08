import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import VocabularyForm from "./vocabulary/VocabularyForm";
import SentenceForm from "./sentences/SentenceForm";
import KanjiForm from "./kanji/KanjiForm";
import { CustomFlashcard, FlashcardFolder } from "../types/flashcards";

const folder: FlashcardFolder = { id: "f1", type: "vocabulary", name: "N5", createdAt: "2026-01-01" };

beforeAll(() => {
    Object.defineProperty(globalThis, "crypto", { value: { randomUUID: () => "uuid" } });
});

const cases = [
    { Component: VocabularyForm, label: "Vocabulario", front: "水", type: "vocabulary", button: "Guardar vocabulario" },
    { Component: SentenceForm, label: "Oracion", front: "猫です", type: "sentence", button: "Guardar oracion" },
    { Component: KanjiForm, label: "Kanji", front: "水", type: "kanji", button: "Guardar kanji" },
] as const;

test.each(cases)("$type form validates and creates cards", async ({ Component, label, front, type, button }) => {
    const add = jest.fn();
    const saved = jest.fn();
    render(<Component folders={[folder]} onAddCard={add} onSaved={saved} />);

    fireEvent.click(screen.getByRole("button", { name: button }));
    expect(add).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "f1" } });
    fireEvent.change(screen.getByLabelText(label), { target: { value: ` ${front} ` } });
    fireEvent.change(screen.getByLabelText(/Pronunciaci/), { target: { value: " mizu " } });
    fireEvent.change(screen.getByLabelText(/Significado/), { target: { value: " agua " } });
    fireEvent.click(screen.getByRole("button", { name: button }));

    await waitFor(() => expect(add).toHaveBeenCalledWith(expect.objectContaining({
        id: "uuid",
        type,
        folderId: "f1",
        front,
        pronunciation: "mizu",
        meaning: "agua",
    })));
    expect(saved).toHaveBeenCalled();
});

test("vocabulary form loads an editing card and handles save errors", async () => {
    const editingCard: CustomFlashcard = {
        id: "c1", type: "vocabulary", folderId: "f1", front: "水",
        pronunciation: "mizu", meaning: "agua", createdAt: "2026-01-01",
    };
    const add = jest.fn().mockRejectedValue(new Error("fail"));
    const saved = jest.fn();
    render(<VocabularyForm folders={[folder]} editingCard={editingCard} onAddCard={add} onSaved={saved} />);
    expect(screen.getByLabelText("Vocabulario")).toHaveValue("水");
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));
    await waitFor(() => expect(add).toHaveBeenCalledWith(editingCard));
    expect(saved).not.toHaveBeenCalled();
});
