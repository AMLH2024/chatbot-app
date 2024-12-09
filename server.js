
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Verificación de Webhook
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Manejo de mensajes entrantes
app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach(async (entry) => {
      const webhook_event = entry.messaging[0];
      const sender_psid = webhook_event.sender.id;

      if (webhook_event.message) {
        const message = webhook_event.message.text;

        // Llamada a ChatGPT
        const reply = await getChatGPTReply(message);

        // Respuesta al usuario
        sendMessage(sender_psid, reply);
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

// Función para interactuar con ChatGPT
async function getChatGPTReply(message) {
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  };
  const data = {
    model: "gpt-4",
    messages: [{ role: "user", content: message }],
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error con ChatGPT:", error);
    return "Lo siento, no puedo responder en este momento.";
  }
}

// Función para enviar mensajes
async function sendMessage(sender_psid, response) {
  const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const url = `https://graph.facebook.com/v15.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

  const messageData = {
    recipient: { id: sender_psid },
    message: { text: response },
  };

  try {
    await axios.post(url, messageData);
  } catch (error) {
    console.error("Error enviando mensaje:", error);
  }
}

app.listen(PORT, () => console.log(`Servidor en ejecución en puerto ${PORT}`));
