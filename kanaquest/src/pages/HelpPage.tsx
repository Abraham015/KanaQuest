import ContactForm from "../components/common/ContactForm";

const quickSteps = [
    {
        number: "1",
        title: "Elige qué estudiar",
        text: "Abre el menú y entra a Hiragana, Katakana, Kanji, Oraciones o Vocabulario.",
    },
    {
        number: "2",
        title: "Prepara tu material",
        text: "Para kanji, oraciones y vocabulario, crea una carpeta y agrega tus propias tarjetas.",
    },
    {
        number: "3",
        title: "Practica",
        text: "Usa tablas y quizzes de kana, o practica tus tarjetas con flashcards, escritura y opción múltiple.",
    },
    {
        number: "4",
        title: "Guarda tu progreso",
        text: "Inicia sesión para sincronizar automáticamente tus carpetas y tarjetas con Supabase.",
    },
];

export default function HelpPage() {
    return (
        <main className="page-container help-page">
            <section className="help-hero">
                <div>
                    <span className="help-eyebrow">Guía de KanaQuest</span>
                    <h1>Cómo utilizar la aplicación</h1>
                    <p>
                        Aprende kana y crea colecciones personalizadas para practicar vocabulario,
                        kanji y oraciones a tu ritmo.
                    </p>
                </div>

                <div className="help-example-card" aria-label="Ejemplo de tarjeta">
                    <span>Ejemplo</span>
                    <strong>猫</strong>
                    <p>ねこ · gato</p>
                </div>
            </section>

            <section className="help-section">
                <h2>Inicio rápido</h2>
                <div className="help-steps">
                    {quickSteps.map((step) => (
                        <article key={step.number} className="help-step">
                            <span>{step.number}</span>
                            <div>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="help-section">
                <h2>Practicar hiragana y katakana</h2>
                <div className="help-grid">
                    <article className="help-card">
                        <span className="help-card-label">Tabla</span>
                        <h3>Consulta los caracteres</h3>
                        <ol>
                            <li>Entra a Hiragana o Katakana.</li>
                            <li>Escoge Básicos, Impuros, Semi-impuros, Compuestos o Todos.</li>
                            <li>Revisa cada carácter junto con su lectura en romaji.</li>
                        </ol>
                    </article>

                    <article className="help-card">
                        <span className="help-card-label">Quiz</span>
                        <h3>Comprueba lo aprendido</h3>
                        <ol>
                            <li>Selecciona la pestaña Quiz.</li>
                            <li>Indica el número de preguntas y las secciones.</li>
                            <li>Escoge la pronunciación correcta entre las opciones.</li>
                        </ol>
                        <div className="help-mini-example">
                            <strong>カ</strong>
                            <span>ka</span>
                            <span>ki</span>
                            <span>ku</span>
                        </div>
                    </article>
                </div>
            </section>

            <section className="help-section">
                <h2>Crear tarjetas personalizadas</h2>
                <div className="help-grid">
                    <article className="help-card">
                        <span className="help-card-label">Paso a paso</span>
                        <ol>
                            <li>Entra a Kanji, Oraciones o Vocabulario.</li>
                            <li>Escribe un nombre y crea una carpeta.</li>
                            <li>Abre la carpeta y pulsa el botón <strong>+</strong>.</li>
                            <li>Completa el texto japonés, pronunciación y significado.</li>
                            <li>Guarda la tarjeta para empezar a practicar.</li>
                        </ol>
                    </article>

                    <article className="help-card">
                        <span className="help-card-label">Ejemplo de vocabulario</span>
                        <dl className="help-example-fields">
                            <div>
                                <dt>Palabra</dt>
                                <dd>水</dd>
                            </div>
                            <div>
                                <dt>Pronunciación</dt>
                                <dd>みず · mizu</dd>
                            </div>
                            <div>
                                <dt>Significado</dt>
                                <dd>agua</dd>
                            </div>
                        </dl>
                    </article>
                </div>
            </section>

            <section className="help-section">
                <h2>Modos de práctica</h2>
                <div className="help-mode-grid">
                    <article className="help-card">
                        <h3>Flashcard</h3>
                        <p>Pulsa la tarjeta para revelar su pronunciación y significado.</p>
                    </article>
                    <article className="help-card">
                        <h3>Respuesta escrita</h3>
                        <p>Escribe la respuesta y revísala antes de avanzar a la siguiente tarjeta.</p>
                    </article>
                    <article className="help-card">
                        <h3>Opción múltiple</h3>
                        <p>Escoge pronunciaciones o significados. Si faltan tarjetas, se añaden opciones de práctica.</p>
                    </article>
                </div>
            </section>

            <section className="help-section help-account-note">
                <div>
                    <h2>Cuenta y sincronización</h2>
                    <p>
                        Sin una cuenta, las tarjetas se guardan en este dispositivo. Al iniciar sesión,
                        KanaQuest sincroniza automáticamente los datos locales con Supabase.
                    </p>
                </div>
                <p>
                    Por seguridad, la sesión se cierra después de 30 minutos sin actividad.
                </p>
            </section>

            <section className="help-section">
                <h2>Consejos</h2>
                <ul className="help-tips">
                    <li>Practica sesiones cortas con frecuencia.</li>
                    <li>Separa las tarjetas por tema, nivel o lección.</li>
                    <li>Usa la búsqueda superior para encontrar caracteres y tarjetas rápidamente.</li>
                    <li>Alterna entre respuesta escrita y opción múltiple para reforzar el recuerdo.</li>
                </ul>
            </section>

            <section className="help-section">
                <span className="help-card-label">Preguntas frecuentes</span>
                <h2>Q&amp;A</h2>
                <div className="faq-list">
                    <details>
                        <summary>¿Necesito una cuenta para utilizar KanaQuest?</summary>
                        <p>No. Puedes estudiar y guardar tarjetas localmente. La cuenta permite sincronizarlas entre sesiones y dispositivos.</p>
                    </details>
                    <details>
                        <summary>¿Qué sucede si practico con pocas tarjetas?</summary>
                        <p>En opción múltiple, KanaQuest completa las respuestas con pronunciaciones o significados de práctica para mantener cuatro opciones.</p>
                    </details>
                    <details>
                        <summary>¿Dónde se guardan mis tarjetas?</summary>
                        <p>Sin sesión se guardan en el navegador. Con sesión iniciada, se sincronizan automáticamente con Supabase.</p>
                    </details>
                    <details>
                        <summary>¿Por qué se cerró mi sesión?</summary>
                        <p>Por seguridad, KanaQuest cierra la sesión después de 30 minutos sin actividad.</p>
                    </details>
                    <details>
                        <summary>¿Cómo cambio o elimino una tarjeta?</summary>
                        <p>Abre su carpeta, entra a Gestionar y utiliza las acciones disponibles en la tarjeta correspondiente.</p>
                    </details>
                    <details>
                        <summary>¿Cómo reporto un problema o sugiero una mejora?</summary>
                        <p>Utiliza el formulario de contacto de esta página. Incluye los pasos para reproducir el problema y el dispositivo utilizado.</p>
                    </details>
                </div>
            </section>

            <section className="help-section contact-section">
                <div>
                    <span className="help-card-label">Soporte</span>
                    <h2>Enviar un mensaje</h2>
                    <p>
                        Envía preguntas, reportes de errores o sugerencias. Tu correo solo se
                        utilizará para responder al mensaje.
                    </p>
                </div>
                <ContactForm />
            </section>
        </main>
    );
}
