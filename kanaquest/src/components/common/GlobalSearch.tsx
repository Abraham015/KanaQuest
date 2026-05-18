import { useEffect, useRef, useState } from "react";
import { Section } from "../../types/navigation";

export type SearchResult = {
    id: string;
    section: Section;
    title: string;
    subtitle: string;
    meta: string;
};

type Props = {
    value: string;
    results: SearchResult[];
    onChange: (value: string) => void;
    onSelectResult: (section: Section) => void;
};

export default function GlobalSearch({
    value,
    results,
    onChange,
    onSelectResult,
}: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const hasQuery = value.trim().length > 0;

    useEffect(() => {
        function handlePointerDown(event: MouseEvent) {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handlePointerDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
        };
    }, []);

    return (
        <div className="global-search" ref={containerRef}>
            <label htmlFor="global-search">Buscar</label>

            <input
                id="global-search"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Caracter japones, pronunciacion o significado"
            />

            {hasQuery && isOpen && (
                <div className="search-results">
                    {results.length ? (
                        results.map((result) => (
                            <button
                                key={result.id}
                                className="search-result"
                                onClick={() => {
                                    setIsOpen(false);
                                    onSelectResult(result.section);
                                }}
                            >
                                <strong>{result.title}</strong>
                                <span>{result.subtitle}</span>
                                <small>{result.meta}</small>
                            </button>
                        ))
                    ) : (
                        <p>No hay coincidencias.</p>
                    )}
                </div>
            )}
        </div>
    );
}
