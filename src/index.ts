import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import crypto from "node:crypto";
import { cors } from "hono/cors";

import { env } from "./config/env.js";
// import { db } from "./db/db.js";
import { webhookTransactions } from "./db/schema.js";
import {
  handleAffiliationByPhone,
  handleDomiciliacionCuenta,
  handleDomiciliacionTelefono,
} from "./r4/domiciliacion.js";
import { GetStatusOperation } from "./r4/consultar-operaciones.js";

const app = new Hono();
app.use("/*", cors());
app.use(logger());

// --- Importante: El SECRETO COMPARTIDO ---
// Este secreto debe COINCIDIR exactamente con el secreto que CIFRAS en tu aplicación NestJS
// para el cliente que estás probando.
// Para un entorno de producción, este secreto provendría de una configuración segura (ej. variables de entorno).
const WEBHOOK_SECRET_FOR_TESTING = env.WEBHOOK_SECRET_KEY;

// --- Endpoint de Prueba General ---
app.get("/", (c) => {
  return c.text("Hello Hono! Webhook receiver is ready.");
});

// --- Endpoint para Recibir Webhooks de Transacciones ---
app.post("/webhook/transaction", async (c) => {
  // 1. Loggear la solicitud recibida
  console.log("[WebhookReceiver] Webhook received!");

  // 2. Obtener el cuerpo RAW de la solicitud
  // Es CRÍTICO obtener el cuerpo como texto plano para la verificación HMAC,
  // ya que el cálculo debe hacerse sobre la cadena exacta que fue firmada.
  const rawBody = await c.req.text();
  console.log("Raw Webhook Body:", JSON.parse(rawBody));

  console.log("--------------------------------------");
  console.log("--------------------------------------");
  console.log("--------------------------------------");

  // 3. Obtener la firma HMAC del encabezado
  const signatureHeader = c.req.header("X-Webhook-Signature");
  console.log("Received X-Webhook-Signature:", signatureHeader);

  console.log("--------------------------------------");
  console.log("--------------------------------------");
  console.log("--------------------------------------");

  // Validar si la firma está presente y tiene el formato correcto
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) {
    console.error("Invalid or missing X-Webhook-Signature header.");
    return c.json({ error: "Missing or invalid signature header" }, 401);
  }

  const receivedSignature = signatureHeader.split("=")[1]; // Extraer solo el hash
  console.log("Received HMAC Signature:", receivedSignature);

  // 4. Verificar la Firma HMAC
  try {
    // Calcular la firma esperada usando el secreto compartido y el cuerpo raw
    const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET_FOR_TESTING);
    hmac.update(rawBody); // Calcular HMAC sobre el cuerpo raw
    const expectedSignature = hmac.digest("hex"); // Obtener el hash en formato hexadecimal

    console.log("Expected HMAC Signature:", expectedSignature);

    // Comparar las firmas de forma segura (para evitar ataques de temporización)
    // `crypto.timingSafeEqual` es una función que compara dos Buffers en tiempo constante.
    // Esto previene ataques que intentarían adivinar el secreto basándose en el tiempo de respuesta.
    if (
      !crypto.timingSafeEqual(
        new Uint8Array(Buffer.from(receivedSignature, "hex")),
        new Uint8Array(Buffer.from(expectedSignature, "hex"))
      )
    ) {
      console.error("HMAC signature mismatch: Signatures do not match.");
      return c.json({ error: "Invalid signature" }, 403); // Prohibido si la firma no coincide
    }

    console.log("HMAC signature is VALID! Proceeding with payload processing.");

    // 5. Procesar el payload del Webhook (Solo si la firma es válida)
    // Convertir el cuerpo a JSON SOLO DESPUÉS de la validación de la firma.
    const webhookData = JSON.parse(rawBody);
    console.log("Parsed Webhook Data:", webhookData);

    // Aquí iría tu lógica de negocio para procesar la notificación:
    // - Actualizar el estado de la transacción.
    // - Enviar un correo de confirmación al cliente final.
    // - Registrar la notificación en tus propios logs.
    // - etc.

    // Simula algún procesamiento...
    console.log(
      `Processing transaction ID: ${webhookData.id} with status: ${webhookData.status}`
    );

    console.log("----------------Data Received----------------");
    console.log(webhookData);
    console.log("---------------------------------------------");

    // 7. Enviar una respuesta exitosa
    // Un 200 OK es la respuesta estándar que espera el emisor del webhook.
    return c.json({
      message: "Webhook received and signature verified successfully!",
    });
  } catch (error) {
    console.error("Error during webhook processing:", error);
    // Manejar errores de parsing JSON o de criptografía
    return c.json(
      { error: "Internal server error or invalid data format." },
      500
    );
  }
});

// --- Endpoint Domiciliación por Cuenta (20 dígitos) ---
app.post("/domiciliacion/cuenta", handleDomiciliacionCuenta);

// --- Endpoint Domiciliación por Teléfono ---
app.post("/domiciliacion/telefono", handleDomiciliacionTelefono);

app.post("/consultar-operaciones", GetStatusOperation);

app.post("domiciliacion/telefono/validation", handleAffiliationByPhone);

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log("--------------------------------------");
    console.log("Routes available:");
    console.log("--------------------------------------");
    console.log("GET /");
    console.log("POST /webhook/transaction");
    console.log("POST /domiciliacion/cuenta");
    console.log("POST /domiciliacion/telefono");
    console.log("POST /consultar-operaciones");
    console.log("--------------------------------------");
  }
);
