import type { Context } from 'hono'
import { v4 as uuidv4 } from 'uuid'

export const hanldePaymentBolivarTDC = async (c: Context) => {
  // Configuración para simulación (fácil de editar)
  const SUCCESS_CVC = '000'
  const SUCCESS_CARD_NUMBER = '4242424242424242'
  const ERROR_AMOUNT = '10100.51'

  // 1. Validar Headers
  const apiKey = c.req.header('apikey')
  const contentType = c.req.header('Content-Type')

  console.log("Headers:", {
    apiKey,
    contentType
  })

  if (!apiKey) {
    return c.json({
      "ok": false,
      "codigo": 1000,
      "mensaje": "Header 'apikey' es requerido",
      "respuesta_codigo": "05",
      "respuesta_numero": "",
      "respuesta_data": ""
    }, 400)
  }

  // Corregido: La validación ahora comprueba si el header *incluye* la cadena
  if (!contentType?.startsWith('multipart/form-data')) {
    return c.json({
      "ok": false,
      "codigo": 1001,
      "mensaje": "Content-Type debe ser 'multipart/form-data'",
      "respuesta_codigo": "05",
      "respuesta_numero": "",
      "respuesta_data": ""
    }, 415)
  }
  // 2. Obtener y validar el Body
  const body = await c.req.formData()

  console.log('body', body)

  const requiredFields = ['monto', 'numero', 'mes', 'ano', 'cvc', 'cedula']

  for (const field of requiredFields) {
    if (!body.get(field)) {
      return c.json({
        "ok": false,
        "codigo": 1002,
        "mensaje": `El campo '${field}' es requerido.`,
        "respuesta_codigo": "05",
        "respuesta_numero": "",
        "respuesta_data": ""
      }, 400)
    }
  }

  const monto = body.get('monto') as string
  const numero = body.get('numero') as string
  const mes = body.get('mes') as string
  const ano = body.get('ano') as string
  const cvc = body.get('cvc') as string
  const referencia = body.get('referencia') as string || Math.floor(Math.random() * 1000000).toString()

  // 3. Simular validaciones de negocio
  const now = new Date()
  const currentYear = now.getFullYear() % 100

  // Validar monto de error
  if (monto === ERROR_AMOUNT) {
    return c.json({
      "ok": false,
      "respuesta_data": "El monto de la operacion es invalido",
      "numero": 150128,
      "codigo": uuidv4(),
      "monto": null,
      "aprobado": false,
      "respuesta_codigo": "51",
      "respuesta_numero": "05",
      "mensaje_sistema": "210 This value must be greater than or equal to 1. parameter_invalid_integer El monto de la operacion es invalido",
      "referencia": referencia
    }, 200)
  }

  // Validar numero de tarjeta
  if (numero !== SUCCESS_CARD_NUMBER) {
    return c.json({
      "ok": false,
      "respuesta_data": "El número de tarjeta es incorrecto.",
      "numero": 511160,
      "codigo": uuidv4(),
      "monto": monto,
      "aprobado": false,
      "respuesta_codigo": "51",
      "respuesta_numero": "05",
      "mensaje_sistema": "214Your card number is incorrect. El número de tarjeta es incorrecto.",
      "referencia": referencia
    }, 200)
  }

  // Validar mes
  if (parseInt(mes) < 1 || parseInt(mes) > 12) {
    return c.json({
      "ok": false,
      "codigo": 1001,
      "mensaje": "El MES ingresado no es valido",
      "respuesta_codigo": "05",
      "respuesta_numero": "",
      "respuesta_data": ""
    }, 200)
  }

  // Validar año
  if (parseInt(ano) < currentYear) {
      return c.json({
        "ok": false,
        "respuesta_data": "El año de vencimiento no es válido.",
        "numero": 479319,
        "codigo": uuidv4(),
        "monto": monto,
        "aprobado": false,
        "respuesta_codigo": "51",
        "respuesta_numero": "05",
        "mensaje_sistema": "214Your card's expiration year is invalid. El año de vencimiento no es válido.",
        "referencia": referencia
      }, 200)
  }

  // Validar CVC
  if (cvc !== SUCCESS_CVC) {
    return c.json({
      "ok": false,
      "codigo": 1004,
      "mensaje": "El CVC ingresado no es valido",
      "respuesta_codigo": "05",
      "respuesta_numero": "",
      "respuesta_data": ""
    }, 200)
  }

  // 4. Simular respuesta de éxito
  const responseData = {
    "ok": true,
    "numero": "700252",
    "codigo": uuidv4(),
    "monto": monto,
    "aprobado": true,
    "respuesta_codigo": "00",
    "respuesta_numero": "ch_3M72a2CrmFtWTw1t0TiNqkj0",
    "respuesta_data": null,
    "referencia": parseInt(referencia)
  }

  return c.json(responseData, 200)
}