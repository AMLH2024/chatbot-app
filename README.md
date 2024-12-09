
# Chatbot App

Este es un chatbot integrado con OpenAI (ChatGPT) y las APIs de Meta (Facebook, Instagram, y WhatsApp). 

## Pasos para configurar

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Configura tus claves en el archivo `.env` basado en `.env.example`:
   - `OPENAI_API_KEY`: Clave de OpenAI.
   - `FACEBOOK_PAGE_ACCESS_TOKEN`: Token de acceso para tu página de Facebook.
   - `VERIFY_TOKEN`: Token de verificación para los webhooks.

3. Inicia el servidor:
   ```bash
   npm start
   ```

4. Usa [ngrok](https://ngrok.com/) para exponer tu servidor local si deseas probar con Meta Webhooks:
   ```bash
   ngrok http 3000
   ```

5. Configura tu Webhook en el panel de Meta Developers usando la URL pública de ngrok.

## Despliegue en la nube
Para implementar esta aplicación en la nube, considera usar plataformas como:
- [Render](https://render.com/)
- [Railway](https://railway.app/)
- [Vercel](https://vercel.com/)

¡Listo para usar!
