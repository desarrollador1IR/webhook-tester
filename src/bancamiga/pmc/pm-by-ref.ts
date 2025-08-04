import type { Context } from "hono";

interface PmByRefRequest {
   Phone: string
   Bank: string
   Date: string
}

interface PmModel {
    ID: string
    created_at: string | null
    update_at: string | null
    deleted_at: string | null
    Dni: string
    PhoneDest: string
    PhoneOrig: string
    Amount: number
    BancoOrig: string
    NroReferenciaCorto: string
    NroReferencia: string
    HoraMovimiento: string
    FechaMovimiento: string
    Descripcion: string
    Status: string
    Refpk: string
    Ref: number
}

interface PmByRefResponse {
    code: number
    lista: PmModel[]
    mod: string
    num: number
}

// Genera una lista de pagos diferentes
const lista: PmModel[] = [
    {
        ID: 'b6639593-7623-41c1-b1e0-4b041a64018f',
        created_at: '2024-07-19T10:12:02.594289-04:00',
        update_at: '2024-07-19T10:12:03.358268-04:00',
        Dni: 'J000000000',
        PhoneDest: '584141320978',
        PhoneOrig: '584141320978',
        Amount: 1,
        BancoOrig: '0172',
        NroReferenciaCorto: '000000',
        NroReferencia: '000000575202',
        HoraMovimiento: '10:12:02',
        FechaMovimiento: '2025-08-04',
        Descripcion: 'pago',
        Status: '500',
        Refpk: '202407190172584240000000575202',
        Ref: 29211968,
        deleted_at: null,
    },
    {
        ID: 'b6639593-7623-41c1-b1e0-4b041a64018f',
        created_at: '2024-07-19T10:12:02.594289-04:00',
        update_at: '2024-07-19T10:12:03.358268-04:00',
        Dni: 'J000000000',
        PhoneDest: '584141320978',
        PhoneOrig: '584141320978',
        Amount: 1,
        BancoOrig: '0172',
        NroReferenciaCorto: '111111',
        NroReferencia: '000000575202',
        HoraMovimiento: '10:12:02',
        FechaMovimiento: '2025-08-04',
        Descripcion: 'pago',
        Status: '500',
        Refpk: '202407190172584240000000575202',
        Ref: 29211968,
        deleted_at: null,
    },
    
]

export async function handleFindPmByRef(c: Context) {

    const authorization = c.req.header('Authorization')

    if(!authorization) {
        return c.json({
            code: 503,
            message: 'Error token no autorizado o expirado'
        }, 401)
    }

    const body = (await c.req.json()) as PmByRefRequest

    const { Phone, Bank, Date } = body

    if(!Phone || !Bank || !Date) {
        return c.json({
            code: 511,
            message: 'Error formato'
        }, 400)
    }

    return c.json({
        code: 200,
        lista: lista,
        mod: 'find',
        num: lista.length
    })

}