import { useEffect, useState } from "react";
import { useSupabaseAccount } from "../../hooks/useSupabaseAccount";

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
    const { displayName, email } = useSupabaseAccount();
    const [name, setName] = useState(displayName || "");
    const [replyTo, setReplyTo] = useState(email || "");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [website, setWebsite] = useState("");
    const [status, setStatus] = useState<FormStatus>("idle");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        setName(displayName || "");
        setReplyTo(email || "");
    }, [displayName, email]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        setStatus("sending");
        setFeedback("");

        try {
            const response = await fetch("/.netlify/functions/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, replyTo, subject, message, website }),
            });
            const result = await response.json();

            if (!response.ok) throw new Error(result.message || "No se pudo enviar el mensaje.");

            setStatus("sent");
            setFeedback("Mensaje enviado. Recibirás una respuesta por correo.");
            setSubject("");
            setMessage("");
        } catch (error) {
            setStatus("error");
            setFeedback(error instanceof Error ? error.message : "No se pudo enviar el mensaje.");
        }
    }

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-fields">
                <label>
                    Nombre
                    <input value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} />
                </label>
                <label>
                    Tu correo
                    <input type="email" value={replyTo} onChange={(event) => setReplyTo(event.target.value)} required maxLength={160} />
                </label>
            </div>
            <label>
                Asunto
                <input value={subject} onChange={(event) => setSubject(event.target.value)} required maxLength={140} placeholder="Ejemplo: problema al practicar vocabulario" />
            </label>
            <label>
                Mensaje
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} required minLength={10} maxLength={4000} rows={6} placeholder="Describe tu pregunta o problema con el mayor detalle posible." />
            </label>
            <label className="contact-honeypot" aria-hidden="true">
                Sitio web
                <input value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} />
            </label>
            <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Enviando..." : "Enviar mensaje"}
            </button>
            {feedback && <p className={`contact-feedback ${status}`}>{feedback}</p>}
        </form>
    );
}
