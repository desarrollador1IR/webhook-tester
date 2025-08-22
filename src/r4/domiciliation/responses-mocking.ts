import crypto from 'node:crypto'

export const getStatusMocking = [
	{
		code: 'ACCP',
		reference: Math.random().toString(),
		status: 'success',
	},
	{
		code: 'AB07',
		message: 'Agente fuera de línea',
		Id: crypto.randomUUID(),
	},
	{
		code: 'AC06',
		message: 'Cuenta bloqueada',
		Id: crypto.randomUUID(),
	},
	{
		code: 'AM02',
		message: 'Monto de la transacción no permitido',
		Id: crypto.randomUUID(),
	},
	{
		code: 'CUST',
		message: 'Cancelación solicitada por el deudor',
		Id: crypto.randomUUID(),
	},
	{
		code: 'FF05',
		message: 'Código del producto incorrecto',
		Id: crypto.randomUUID(),
	},
]

export const domiciliationMocking = [
	{
		codigo: '202',
		mensaje: 'Se ha recibido el mensaje de forma satisfactoria',
		uuid: crypto.randomUUID(),
	},
	{
		codigo: '07',
		mensaje: 'Request Inválida, error en el campo: DocId',
		uuid: '',
	},
	{
		codigo: '11',
		mensaje: 'Error de respuesta',
	},
	{
		code: 'ACCP',
		reference: Math.random().toString(),
		status: 'success',
	},
]
