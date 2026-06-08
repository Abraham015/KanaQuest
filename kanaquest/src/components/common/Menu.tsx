import { Section } from "../../types/navigation";

type Props = {
    isOpen: boolean;
    activeSection: Section;
    onChangeSection: (section: Section) => void;
};

const menuItems: Array<{ section: Section; label: string }> = [
    { section: "hiragana", label: "Hiragana" },
    { section: "katakana", label: "Katakana" },
    { section: "kanji", label: "Kanji" },
    { section: "sentences", label: "Oraciones" },
    { section: "vocabulary", label: "Vocabulario" },
    { section: "grammar", label: "Gramática" },
    { section: "help", label: "Cómo usar" },
    { section: "account", label: "Cuenta" },
];

export default function Menu({ isOpen, activeSection, onChangeSection }: Props) {
    return (
        <nav className={`side-menu ${isOpen ? "is-open" : ""}`}>
            <div className="side-menu-header">
                <span>KanaQuest</span>
                <small>Tu espacio de estudio</small>
            </div>

            <div className="side-menu-links">
                {menuItems.map((item) => (
                    <button
                        key={item.section}
                        className={activeSection === item.section ? "is-active" : ""}
                        onClick={() => onChangeSection(item.section)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}
