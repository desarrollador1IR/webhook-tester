import crypto from 'node:crypto'
import { type Context } from 'hono'

interface C2PRequest {
	TelefonoDestino: string
	Cedula: string
	Concepto: string
	Banco: string
	Ip?: string
	Monto: string
	Otp: string
}

interface C2PResponse {
	message: string
	code: string
	reference?: string
}

// Función para generar el token de autorización
function generateAuthToken(
	telefonoDestino: string,
	monto: string,
	banco: string,
	cedula: string,
	commerceToken: string,
): string {
	const dataToHash = `${telefonoDestino}${monto}${banco}${cedula}`
	const hmac = crypto.createHmac('sha256', commerceToken)
	hmac.update(dataToHash)
	return hmac.digest('hex')
}

// Función para validar el token de autorización
function validateAuthToken(
	receivedToken: string,
	telefonoDestino: string,
	monto: string,
	banco: string,
	cedula: string,
	commerceToken: string,
): boolean {
	const expectedToken = generateAuthToken(
		telefonoDestino,
		monto,
		banco,
		cedula,
		commerceToken,
	)
	return receivedToken === expectedToken
}

// Función para generar una referencia única
function generateReference(): string {
	return (Math.floor(Math.random() * 90000000) + 10000000).toString()
}

export async function handleR4C2p(c: Context) {
	try {
		// Obtener headers
		const authorization = c.req.header('Authorization')
		const commerce = c.req.header('Commerce')
		// const contentType = c.req.header('Content-Type')

		// Validar headers requeridos
		if (!authorization) {
			return c.json(
				{
					code: '08',
					message: 'TOKEN inválido',
				},
				401,
			)
		}

		if (!commerce) {
			return c.json(
				{
					code: '15',
					message: 'Llave Erronea',
				},
				401,
			)
		}

		// if (contentType !== 'application/json') {
		// 	return c.json(
		// 		{
		// 			code: '30',
		// 			message: 'Error en formato:30',
		// 		},
		// 		400,
		// 	)
		// }

		// Obtener el cuerpo de la solicitud
		const body = (await c.req.json()) as C2PRequest

		const { TelefonoDestino, Monto, Banco, Cedula, Otp, Concepto } = body

		// Validar campos requeridos
		if (!TelefonoDestino || !Monto || !Banco || !Cedula || !Otp || !Concepto) {
			return c.json(
				{
					code: '30',
					message: 'Error en formato:30',
				},
				400,
			)
		}

		// Validar formato del teléfono (debe ser un número venezolano)
		const phoneRegex = /^0[24]\d{9}$/
		if (!phoneRegex.test(body.TelefonoDestino)) {
			return c.json(
				{
					code: '56',
					message: 'Numero de celular no coincide',
				},
				400,
			)
		}

		// Validar formato de la cédula (debe ser un número venezolano y debe contender el (V, E, J, G))
		const cedulaRegex = /^(V|E|J|G)\d{7,8}$/
		if (!cedulaRegex.test(Cedula)) {
			return c.json(
				{
					code: '80',
					message: 'Documento de identificación errado',
				},
				400,
			)
		}

		// Validar formato del monto
		const montoRegex = /^\d+(\.\d{1,2})?$/
		if (!montoRegex.test(Monto)) {
			return c.json(
				{
					code: '30',
					message: 'Error en formato:30',
				},
				400,
			)
		}

		// Validar token de autorización
		// if (
		// 	!validateAuthToken(
		// 		authorization,
		// 		body.telefonoDestino,
		// 		body.monto,
		// 		body.banco,
		// 		body.cedula,
		// 		commerce,
		// 	)
		// ) {
		// 	return c.json(
		// 		{
		// 			code: '08',
		// 			message: 'TOKEN inválido',
		// 		},
		// 		401,
		// 	)
		// }

		// Simular diferentes casos según los parámetros

		// Caso 1: Transacción exitosa con OTP específico y monto específico
		if (Otp === '12345678' && Monto === '10.00') {
			return c.json({
				message: 'TRANSACCION EXITOSA',
				code: '00',
				reference: generateReference(),
			})
		}

		// Caso 2: Banco fuera de servicio (simular con ciertos bancos)
		const bancosFueraServicio = ['0102', '0172']
		if (bancosFueraServicio.includes(Banco.toUpperCase())) {
			return c.json(
				{
					code: '41',
					message: 'Transaccipon no permitida Banco fuera de servicio',
				},
				400,
			)
		}

		// Caso 3: Insuficiencia de fondos (simular con montos altos)
		const montoNumerico = parseFloat(Monto)
		if (montoNumerico > 1000) {
			return c.json(
				{
					code: '51',
					message: 'Insuficiencia de Fondos',
				},
				400,
			)
		}

		// Caso 4: Número de celular no coincide (simular con ciertos números)
		const numerosInvalidos = ['0412000000', '0424000000', '0000000000']
		if (numerosInvalidos.includes(TelefonoDestino)) {
			return c.json(
				{
					code: '56',
					message: 'Numero de celular no coincide',
				},
				400,
			)
		}

		// Caso 5: Documento de identificación errado (simular con ciertas cédulas)
		const cedulasInvalidas = ['V0000000', 'E1234567', 'J9999999']
		if (cedulasInvalidas.includes(Cedula)) {
			return c.json(
				{
					code: '80',
					message: 'Documento de identificación errado',
				},
				400,
			)
		}

		// Caso 6: Llave errónea (simular con ciertos tokens de comercio)
		const tokensInvalidos = ['INVALID_TOKEN', 'WRONG_KEY', 'TEST_ERROR']
		if (tokensInvalidos.includes(commerce)) {
			return c.json(
				{
					code: '15',
					message: 'Llave Erronea',
				},
				401,
			)
		}

		// Caso 7: Transacción exitosa por defecto (para casos válidos)
		// Simular éxito con probabilidad del 70% para casos no específicos
		const randomSuccess = Math.random() < 0.7

		if (randomSuccess) {
			return c.json({
				message: 'TRANSACCION EXITOSA',
				code: '00',
				reference: generateReference(),
			})
		} else {
			// Simular error aleatorio
			const errorCodes = [
				{ code: '08', message: 'TOKEN inválido' },
				{ code: '15', message: 'Llave Erronea' },
				{ code: '30', message: 'Error en formato:30' },
				{
					code: '41',
					message: 'Transaccipon no permitida Banco fuera de servicio',
				},
				{ code: '51', message: 'Insuficiencia de Fondos' },
				{ code: '56', message: 'Numero de celular no coincide' },
				{ code: '80', message: 'Documento de identificación errado' },
			]

			const randomError =
				errorCodes[Math.floor(Math.random() * errorCodes.length)]
			return c.json(randomError, 400)
		}
	} catch (error) {
		console.error('Error en endpoint C2P:', error)
		return c.json(
			{
				code: '30',
				message: 'Error en formato:30',
			},
			500,
		)
	}
}
