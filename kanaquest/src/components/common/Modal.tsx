import { ReactNode } from "react";

type Props = {
    title: string;
    children: ReactNode;
    onClose: () => void;
};

export default function Modal({ title, children, onClose }: Props) {
    return (
        <div className="modal-layer" role="dialog" aria-modal="true">
            <button className="modal-backdrop" onClick={onClose} aria-label="Cerrar" />

            <section className="modal-panel">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Cerrar">
                        x
                    </button>
                </div>

                {children}
            </section>
        </div>
    );
}
