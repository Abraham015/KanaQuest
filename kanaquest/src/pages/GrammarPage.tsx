export default function GrammarPage() {
    return (
        <main className="page-container grammar-page">
            <section className="coming-soon-card">
                <span className="coming-soon-label">Próximamente</span>
                <div className="coming-soon-character" aria-hidden="true">文</div>
                <h1>Gramática japonesa</h1>
                <p>
                    Estamos preparando lecciones y ejercicios para ayudarte a construir
                    oraciones y comprender las estructuras del japonés.
                </p>

                <div className="coming-soon-preview">
                    <article>
                        <span>01</span>
                        <div>
                            <h2>Partículas</h2>
                            <p>Aprende a utilizar は, が, を, に y otras partículas comunes.</p>
                        </div>
                    </article>
                    <article>
                        <span>02</span>
                        <div>
                            <h2>Estructuras</h2>
                            <p>Construye frases afirmativas, negativas y preguntas.</p>
                        </div>
                    </article>
                    <article>
                        <span>03</span>
                        <div>
                            <h2>Ejercicios</h2>
                            <p>Practica cada tema con ejemplos y actividades guiadas.</p>
                        </div>
                    </article>
                </div>

                <strong className="coming-soon-message">
                    Esta sección estará disponible próximamente.
                </strong>
            </section>
        </main>
    );
}
