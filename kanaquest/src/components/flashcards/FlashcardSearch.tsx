type Props = {
    value: string;
    onChange: (value: string) => void;
};

export default function FlashcardSearch({ value, onChange }: Props) {
    return (
        <section className="flashcard-search">
            <label htmlFor="flashcard-search">Buscar</label>

            <input
                id="flashcard-search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Caracter japones, pronunciacion o significado"
            />
        </section>
    );
}
