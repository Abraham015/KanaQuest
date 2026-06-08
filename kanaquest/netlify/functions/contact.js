const RESEND_ENDPOINT = "https://api.resend.com/emails";

function response(statusCode, message) {
    return {
        statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    };
}

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

exports.handler = async function handler(event) {
    if (event.httpMethod !== "POST") return response(405, "Método no permitido.");

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !toEmail || !fromEmail) {
        return response(503, "El servicio de contacto todavía no está configurado.");
    }

    try {
        const body = JSON.parse(event.body || "{}");
        const name = String(body.name || "").trim();
        const replyTo = String(body.replyTo || "").trim();
        const subject = String(body.subject || "").trim();
        const message = String(body.message || "").trim();
        const website = String(body.website || "").trim();

        if (website) return response(200, "Mensaje enviado.");

        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo);

        if (!name || !isValidEmail || !subject || message.length < 10) {
            return response(400, "Completa todos los campos correctamente.");
        }

        if (name.length > 80 || replyTo.length > 160 || subject.length > 140 || message.length > 4000) {
            return response(400, "Uno de los campos supera el límite permitido.");
        }

        const emailResponse = await fetch(RESEND_ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: fromEmail,
                to: [toEmail],
                reply_to: replyTo,
                subject: `[KanaQuest] ${subject}`,
                html: `
                    <h2>Nuevo mensaje desde KanaQuest</h2>
                    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
                    <p><strong>Correo:</strong> ${escapeHtml(replyTo)}</p>
                    <p><strong>Asunto:</strong> ${escapeHtml(subject)}</p>
                    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
                `,
            }),
        });

        if (!emailResponse.ok) {
            console.error("Resend error", await emailResponse.text());
            return response(502, "No se pudo enviar el mensaje.");
        }

        return response(200, "Mensaje enviado.");
    } catch (error) {
        console.error("Contact function error", error);
        return response(500, "No se pudo procesar el mensaje.");
    }
};
