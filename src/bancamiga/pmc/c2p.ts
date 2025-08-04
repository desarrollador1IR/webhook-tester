import type { Context } from "hono"


interface C2pRequest {
    Banco_origen: string
    Telf_origen: string
    Dni_origen: string
    Monto: string
    Motivo: string
    Otp: string
}

type C2pStatus = 'APROBADO' | 'NO APROBADO'


interface C2pResponse {
    code: number
    data: {
        Amount: number
        Banco: string
        Canal: string
        Code: string
        Created_at: string
        Dataorig: string
        Dni: string
        Error: string
        ID: string
        Nroref: string
        Phonedest: string
        Phoneorig: string
        Status: C2pStatus
        Update_at: string
    }
    mod: string
}


interface C2pErrorResponse {
    code: number
    data: {
        Amount: number
        Banco: string
        Canal: string
        Code: string
        Created_at: string
        Dataorig: string
        Dni: string
        Error: string
        ID: string
        Nroref: string
        Phonedest: string
        Phoneorig: string
        Status: C2pStatus
        Update_at: string
    }
    mod: string
}

const generateRandomId = () => {
    return crypto.randomUUID()
}

// Función para generar una referencia única
function generateReference(): string {
	return (Math.floor(Math.random() * 90000000) + 10000000).toString()
}

// Simulador del pago por C2P de bancamiga
export async function handlePaymentC2p(c: Context){

    const VALID_OTP = '12345678'
    const INSUFFICIENT_FUNDS_VALUE = 1000

    const authorization = c.req.header('Authorization')

    if(!authorization) {
        return c.json({
            code: 401,
            message: 'Unauthorized'
        }, 401)
    }

    const body = (await c.req.json()) as C2pRequest

    const { Banco_origen, Dni_origen, Monto, Motivo, Otp, Telf_origen } = body

    if(!Banco_origen || !Telf_origen || !Dni_origen || !Monto || !Motivo || !Otp) {
        return c.json({
            code: 400,
            message: 'Error en formato del request'
        }, 400)
    }

    if(Otp !== VALID_OTP) {
        return c.json<C2pErrorResponse>({
            "code": 550,
            "data": {
            "Amount": parseFloat(Monto),
            "Banco": Banco_origen,
            "Canal": "API",
            "Code": "E029",
            "Created_at": new Date().toISOString(),
            "Dataorig": "",
            "Dni": Dni_origen,
            "Error": "Otp vencido",
            "ID": generateRandomId(),
            "Nroref": "",
            "Phonedest": Telf_origen,
            "Phoneorig": Telf_origen,
            "Status": "NO APROBADO",
            "Update_at": new Date().toISOString()
            },
            "mod": "c2p/payment"

        }, 400)
    }

    // si el monto es mayor a 1.000 mandara un error de no tener fondos en la cuenta
    if(parseFloat(Monto) > INSUFFICIENT_FUNDS_VALUE) {
        return c.json<C2pErrorResponse>({
            "code": 550,
            "data": {
            "Amount": parseFloat(Monto),
            "Banco": Banco_origen,
            "Canal": "API",
            "Code": "E029",
            "Created_at": new Date().toISOString(),
            "Dataorig": "",
            "Dni": Dni_origen,
            "Error": "Insuficiencia de fondos",
            "ID": generateRandomId(),
            "Nroref": generateReference(),
            "Phonedest": Telf_origen,
            "Phoneorig": Telf_origen,
            "Status": "NO APROBADO",
            "Update_at": new Date().toISOString()
            },
            "mod": "c2p/payment"

        }, 400)
    }

    return c.json<C2pResponse>({
        code: 200,
        data: {
            Amount: parseFloat(Monto),
            Banco: Banco_origen,
            Canal: "API",
            Code: "E029",
            Created_at: new Date().toISOString(),
            Dataorig: "",
            Dni: Dni_origen,
            Error: "",
            ID:     generateRandomId(),
            Nroref: generateReference(),
            Phonedest: Telf_origen,
            Phoneorig: Telf_origen,
            Status: "APROBADO",
            Update_at: new Date().toISOString()
        },
        mod: "c2p/payment"
    })
}

