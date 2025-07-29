import type { Context } from "hono";
import crypto from "node:crypto";

// Utilidad para verificar HMAC-SHA256
// function verifyHmac({
//   valueToSign,
//   secret,
//   receivedSignature,
// }: {
//   valueToSign: string;
//   secret: string;
//   receivedSignature: string;
// }): boolean {
//   const hmac = crypto.createHmac("sha256", secret);
//   hmac.update(valueToSign);
//   const expectedSignature = hmac.digest("hex");
//   return crypto.timingSafeEqual(
//     Buffer.from(receivedSignature, "hex"),
//     Buffer.from(expectedSignature, "hex")
//   );
// }

// Handler para domiciliación por cuenta (20 dígitos)
export async function handleDomiciliacionCuenta(c: Context) {
  const commerceToken = c.req.header("Commerce");
  const authorization = c.req.header("Authorization");

  if (!commerceToken || !authorization) {
    return c.json({ codigo: "11", mensaje: "Error de respuesta", uuid: "" }, 401);
  }

  const body = await c.req.json();
  const { cuenta, monto, docId, nombre, concepto } = body;

  // El valor a firmar es la cuenta
//   const receivedSignature = authorization;
//   const isValid = verifyHmac({
//     valueToSign: cuenta,
//     secret: commerceToken,
//     receivedSignature,
//   });

//   if (!isValid) {
//     return c.json({ codigo: "11", mensaje: "Error de respuesta", uuid: "" }, 401);
//   }

  // Simulación de lógica bancaria
  if (parseFloat(monto) > 500) {
    return c.json({
      codigo: "202",
      mensaje: "Se ha recibido el mensaje de forma satisfactoria",
      uuid: 'e63a7892-f00f-46a4-b7d1-a6e8ac7ab094',
      // uuid: crypto.randomUUID(),
    });
  } else if (!docId || !cuenta || !nombre || !concepto) {
    return c.json({ codigo: "07", mensaje: "Request Inválida, error en el campo: DocId", uuid: "" });
  } else {
    return c.json({ codigo: "11", mensaje: "Error de respuesta", uuid: "" });
  }
}

// Handler para domiciliación por teléfono
export async function handleDomiciliacionTelefono(c: Context) {
  const commerceToken = c.req.header("Commerce");
  const authorization = c.req.header("Authorization");

  if (!commerceToken || !authorization) {
    return c.json({ codigo: "11", mensaje: "Error de respuesta", uuid: "" }, 401);
  }

  const body = await c.req.json();
  const { telefono, monto, docId, nombre, banco, concepto } = body;

  // El valor a firmar es el teléfono
//   const receivedSignature = authorization;
//   const isValid = verifyHmac({
//     valueToSign: telefono,
//     secret: commerceToken,
//     receivedSignature,
//   });

//   if (!isValid) {
//     return c.json({ codigo: "11", mensaje: "Error de respuesta", uuid: "" }, 401);
//   }

  const goodUUID = 'e63a7892-f00f-46a4-b7d1-a6e8ac7ab094'
  const badUUID = crypto.randomUUID()

  const isGood = !false

  // Simulación de lógica bancaria
  if (parseFloat(monto) < 500) {
    return c.json({
      codigo: "202",
      mensaje: "Se ha recibido el mensaje de forma satisfactoria",
      // uuid: 'e63a7892-f00f-46a4-b7d1-a6e8ac7ab094',
      uuid: isGood ? goodUUID : badUUID,
    });
  } else if (!docId || !telefono || !nombre || !banco || !concepto) {
    return c.json({ codigo: "07", mensaje: "Request Inválida, error en el campo: DocId", uuid: "" });
  } else {
    return c.json({ codigo: "11", mensaje: "Error de respuesta", uuid: "" });
  }
} 