import { type Context } from 'hono'
import crypto from 'crypto'

interface DebitoInmediatoRequest {
	Banco: string
	Monto: string
	Telefono: string
	Cedula: string
	Nombre: string
	OTP: string
	Concepto: string
}

// Array de códigos de error para respuestas aleatorias
const errorCodes = [
	{ code: 'AB01', message: 'Tiempo de espera agotado' },
	{ code: 'AB07', message: 'Agente fuera de línea' },
	{ code: 'AC01', message: 'Número de cuenta incorrecto' },
	{ code: 'AC04', message: 'Cuenta cancelada' },
	{ code: 'AC06', message: 'Cuenta bloqueada' },
	{ code: 'AC09', message: 'Moneda no válida' },
	{ code: 'AG01', message: 'Transacción Restringida' },
	{ code: 'AG09', message: 'Pago no recibido' },
	{ code: 'AG10', message: 'Agente suspendido o excluido' },
	{ code: 'AM02', message: 'Monto de la transacción no permitido' },
	{ code: 'AM04', message: 'Saldo insuficiente' },
	{ code: 'AM05', message: 'Operación duplicada' },
	{ code: 'BE01', message: 'Datos del cliente no corresponden a la cuenta' },
	{ code: 'BE20', message: 'Longitud del nombre invalida' },
	{ code: 'CH20', message: 'Número de decimales incorrecto' },
	{ code: 'CUST', message: 'Cancelación solicitada por el deudor' },
	{ code: 'DS02', message: 'Operación Cancelada' },
	{ code: 'DT03', message: 'Fecha de procesamiento no bancaria no válida' },
]

// Función para generar ID único
const generateId = () => {
	return crypto.randomUUID()
}

// Función para obtener error aleatorio
const getRandomError = () => {
	const randomIndex = Math.floor(Math.random() * errorCodes.length)
	return {
		...errorCodes[randomIndex],
		Id: generateId(),
	}
}

export const handleDebitoInmediato = async (c: Context) => {
	try {
		// Obtener headers
		const authorization = c.req.header('Authorization')
		const commerce = c.req.header('Commerce')

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

		// Obtener el cuerpo de la solicitud
		const body = (await c.req.json()) as DebitoInmediatoRequest

		const { Banco, Monto, Telefono, Cedula, Nombre, OTP, Concepto } = body

		// Validar campos requeridos
		if (
			!Banco ||
			!Monto ||
			!Telefono ||
			!Cedula ||
			!Nombre ||
			!OTP ||
			!Concepto
		) {
			return c.json(
				{
					code: '30',
					message: 'Error en formato:30',
				},
				400,
			)
		}

		// Validar formato del banco (4 dígitos numéricos)
		if (!/^\d{4}$/.test(Banco)) {
			return c.json(
				{
					code: '30',
					message: 'Error en formato:30',
				},
				400,
			)
		}

		// Validar formato del monto
		if (!/^\d{1,8}\.\d{2}$/.test(Monto)) {
			return c.json(
				{
					code: 'CH20',
					message: 'Número de decimales incorrecto',
					Id: generateId(),
				},
				400,
			)
		}

		// Validar formato del teléfono (11 dígitos numéricos)
		if (!/^\d{11}$/.test(Telefono)) {
			return c.json(
				{
					code: '30',
					message: 'Error en formato:30',
				},
				400,
			)
		}

		// Validar formato de la cédula (V, E, J o G + 8 dígitos numéricos)
		if (!/^[VEJG]\d{8}$/.test(Cedula)) {
			return c.json(
				{
					code: '30',
					message: 'Error en formato:30',
				},
				400,
			)
		}

		// Validar longitud del nombre (máximo 20 caracteres)
		if (Nombre.length > 20) {
			return c.json(
				{
					code: 'BE20',
					message: 'Longitud del nombre invalida',
					Id: generateId(),
				},
				400,
			)
		}

		// Validar formato del OTP (8 dígitos numéricos)
		if (!/^\d{8}$/.test(OTP)) {
			return c.json(
				{
					code: '30',
					message: 'Error en formato:30',
				},
				400,
			)
		}

		// Validar longitud del concepto (máximo 30 caracteres)
		if (Concepto.length > 30) {
			return c.json(
				{
					code: '30',
					message: 'Error en formato:30',
				},
				400,
			)
		}

		// Convertir monto a número para validaciones
		const montoNumero = parseFloat(Monto)

		// Lógica de validación según las reglas especificadas
		const otpCorrecto = '12345678'
		const montoExitoso = 10.0

		// Caso 1: OTP correcto y monto exitoso (10.00) - Respuesta exitosa
		if (OTP === otpCorrecto && montoNumero === montoExitoso) {
			return c.json({
				code: 'ACCP',
				message: 'Operación Aceptada',
				reference: Math.floor(Math.random() * 90000000) + 10000000, // Generar referencia aleatoria de 8 dígitos
				id: generateId(),
			})
		}

		// Caso 2: OTP correcto y monto menor a 1000.00 - En espera de respuesta
		if (
			// OTP === otpCorrecto
			// &&
			montoNumero < 1000.0
		) {
			return c.json(
				{
					code: 'AC00',
					message: 'Operación en Espera de Respuesta del Receptor',
					Id: generateId(),
				},
				400,
			)
		}

		// Caso 3: Monto mayor a 1000.00 - Error aleatorio
		if (montoNumero > 1000.0) {
			return c.json(getRandomError(), 400)
		}

		// Caso 4: OTP incorrecto - Error aleatorio
		if (OTP !== otpCorrecto) {
			return c.json(getRandomError(), 400)
		}

		// Caso por defecto: Error aleatorio
		return c.json(getRandomError(), 400)
	} catch (error) {
		console.error('Error en endpoint Debito Inmediato:', error)
		return c.json(
			{
				code: '30',
				message: 'Error en formato:30',
			},
			500,
		)
	}
}
