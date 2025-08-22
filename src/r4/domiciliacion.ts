import type { Context } from 'hono'
// import crypto from 'node:crypto'
// import { db } from '../db/db.js'
// import { DomiciliationTransactions } from '../db/schema.js'
import { domiciliationMocking } from './domiciliation/responses-mocking.js'

// Handler para domiciliación por cuenta (20 dígitos)
export async function handleDomiciliacionCuenta(c: Context) {
	const commerceToken = c.req.header('Commerce')
	const authorization = c.req.header('Authorization')

	if (!commerceToken || !authorization) {
		return c.json(
			{ codigo: '11', mensaje: 'Error de respuesta', uuid: '' },
			401,
		)
	}

	const body = await c.req.json()
	const { cuenta, monto, docId, nombre, concepto } = body

	if (parseFloat(monto) < 0) {
		return c.json({
			codigo: 'AM02',
			mensaje: 'Monto de la transacción no permitido',
			uuid: '',
		})
	}

	// ACCP
	if (parseFloat(monto) > 1000) {
		return c.json({
			code: 'ACCP',
			reference: '16413121',
			status: 'success',
		})
	}

	if (parseFloat(monto) < 500) {
		return c.json({
			codigo: '202',
			mensaje: 'Se ha recibido el mensaje de forma satisfactoria',
			uuid: '04c8a596-f1c5-4c68-a984-2216ff98',
		})
	}

	// // if mount > 500, its pending.
	// if (parseFloat(monto) > 500) {
	// 	return c.json({
	// 		codigo: '202',
	// 		mensaje: 'Se ha recibido el mensaje de forma satisfactoria',
	// 		uuid: crypto.randomUUID(),
	// 		// uuid: 'e63a7892-f00f-46a4-b7d1-a6e8ac7ab094',
	// 	})
	// } else if (!docId || !cuenta || !nombre || !concepto) {
	// 	return c.json({
	// 		codigo: '07',
	// 		mensaje: 'Request Inválida, error en el campo: DocId',
	// 		uuid: '',
	// 	})
	// } else {
	// 	return c.json({ codigo: '11', mensaje: 'Error de respuesta', uuid: '' })
	// }
}

// Handler para domiciliación por teléfono
export async function handleDomiciliacionTelefono(c: Context) {
	const commerceToken = c.req.header('Commerce')
	const authorization = c.req.header('Authorization')

	if (!commerceToken || !authorization) {
		return c.json(
			{ codigo: '11', mensaje: 'Error de respuesta', uuid: '' },
			401,
		)
	}

	const body = await c.req.json()
	const { telefono, monto, docId, nombre, banco, concepto } = body

	if (parseFloat(monto) < 0) {
		return c.json({
			codigo: 'AM02',
			mensaje: 'Monto de la transacción no permitido',
			uuid: '',
		})
	}

	// ACCP
	if (parseFloat(monto) > 1000) {
		return c.json({
			code: 'ACCP',
			reference: '16413121',
			status: 'success',
		})
	}

	if (parseFloat(monto) < 500) {
		return c.json({
			codigo: '202',
			mensaje: 'Se ha recibido el mensaje de forma satisfactoria',
			uuid: '04c8a596-f1c5-4c68-a984-2216ff98',
		})
	}

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

	// const goodUUID = 'e63a7892-f00f-46a4-b7d1-a6e8ac7ab094'
	// const badUUID = crypto.randomUUID()

	// const isGood = !false

	// // Simulación de lógica bancaria
	// if (parseFloat(monto) < 500) {
	// 	return c.json({
	// 		codigo: '202',
	// 		mensaje: 'Se ha recibido el mensaje de forma satisfactoria',
	// 		// uuid: 'e63a7892-f00f-46a4-b7d1-a6e8ac7ab094',
	// 		uuid: isGood ? goodUUID : badUUID,
	// 	})
	// } else if (!docId || !telefono || !nombre || !banco || !concepto) {
	// 	return c.json({
	// 		codigo: '07',
	// 		mensaje: 'Request Inválida, error en el campo: DocId',
	// 		uuid: '',
	// 	})
	// } else {
	// 	return c.json({ codigo: '11', mensaje: 'Error de respuesta', uuid: '' })
	// }
}

export async function handleGetOrderStatus(c: Context) {
	const commerceToken = c.req.header('Commerce')
	const authorization = c.req.header('Authorization')

	if (!commerceToken || !authorization) {
		return c.json(
			{ codigo: '11', mensaje: 'Error de respuesta', uuid: '' },
			401,
		)
	}

	const body = await c.req.json()
	const { Id } = body

	// Seleccionar un mensaje aleatorio de domiciliationMocking
	const randomIndex = Math.floor(Math.random() * domiciliationMocking.length)
	const randomResponse = domiciliationMocking[randomIndex]

	return c.json(randomResponse)
}
