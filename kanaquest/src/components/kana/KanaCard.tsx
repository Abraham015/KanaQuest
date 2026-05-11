import { KanaCard as KanaCardType } from "../../types/study";

type Props = {
    kana: KanaCardType;
};

export default function KanaCard({ kana }: Props) {
    return (
        <div className="kana-card">
            <h2>{kana.character}</h2>
            <p>{kana.romaji}</p>
            <span>{kana.group}</span>
        </div>
    );
}