import { act, fireEvent, render, screen } from "@testing-library/react";
import KanaMultipleChoice from "./kana/KanaMultipleChoice";
import FlashcardPractice from "./flashcards/FlashcardPractice";
import { CustomFlashcard } from "../types/flashcards";
import { KanaCard } from "../types/study";

const kanaCards: KanaCard[] = [
    { id: "a", type: "hiragana", category: "basic", character: "あ", romaji: "a", group: "vowels" },
    { id: "i", type: "hiragana", category: "basic", character: "い", romaji: "i", group: "vowels" },
    { id: "u", type: "hiragana", category: "basic", character: "う", romaji: "u", group: "vowels" },
    { id: "e", type: "hiragana", category: "basic", character: "え", romaji: "e", group: "vowels" },
];

const cards: CustomFlashcard[] = [
    { id: "1", type: "vocabulary", folderId: "f", front: "水", pronunciation: "mizu", meaning: "agua", createdAt: "2026" },
    { id: "2", type: "vocabulary", folderId: "f", front: "猫", pronunciation: "neko", meaning: "gato", createdAt: "2026" },
];

beforeEach(() => {
    jest.spyOn(Math, "random").mockReturnValue(0.5);
});

afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
});

test("kana multiple choice handles empty, answers and restart", () => {
    const { rerender } = render(<KanaMultipleChoice cards={[]} totalQuestions={1} />);
    expect(screen.getByText("No hay tarjetas disponibles.")).toBeInTheDocument();

    jest.useFakeTimers();
    rerender(<KanaMultipleChoice cards={kanaCards} totalQuestions={1} />);
    fireEvent.click(screen.getByRole("button", { name: "a" }));
    act(() => jest.advanceTimersByTime(700));
    expect(screen.getByText("Resultado final")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reiniciar quiz" }));
    expect(screen.getByText(/Pregunta 1 de 1/)).toBeInTheDocument();
});

test("flashcard practice handles empty state and flashcard completion", () => {
    const { rerender } = render(<FlashcardPractice cards={[]} />);
    expect(screen.getByText(/No hay flashcards/)).toBeInTheDocument();
    rerender(<FlashcardPractice cards={cards} />);
    fireEvent.click(screen.getByRole("button", { name: "Iniciar práctica" }));
    fireEvent.click(screen.getByText("水"));
    expect(screen.getByText("Pronunciación")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(screen.getByText("Practica terminada")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Practicar otra vez" }));
    expect(screen.getByRole("button", { name: "Iniciar práctica" })).toBeInTheDocument();
});

test("flashcard practice validates written answers", () => {
    render(<FlashcardPractice cards={cards} />);
    fireEvent.change(screen.getByLabelText(/Modo/), { target: { value: "written" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar práctica" }));
    fireEvent.change(screen.getByLabelText("Respuesta"), { target: { value: "水" } });
    fireEvent.click(screen.getByRole("button", { name: "Revisar" }));
    expect(screen.getByText("Correcto")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(screen.getByText("Practica terminada")).toBeInTheDocument();
});

test("flashcard practice advances multiple choice answers", () => {
    jest.useFakeTimers();
    render(<FlashcardPractice cards={[cards[0]]} />);
    fireEvent.change(screen.getByLabelText(/Modo/), { target: { value: "multiple-choice" } });
    fireEvent.click(screen.getByRole("button", { name: "Iniciar práctica" }));
    fireEvent.click(screen.getByRole("button", { name: "agua" }));
    act(() => jest.advanceTimersByTime(800));
    expect(screen.getByText("Practica terminada")).toBeInTheDocument();
});
