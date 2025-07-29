import type { Context } from "hono";


// Define las interfaces para los modelos de Request y Response
interface ConsultarOperacionesRequest {
    Id: string; // UUID
  }
  
  interface ConsultarOperacionesResponse {
    code: string;
    reference?: string; // Opcional para respuestas de éxito
    success?: boolean;  // Opcional para respuestas de éxito
    message?: string;   // Opcional para respuestas de error
    Id?: string
  }

// =========================================================================
// Función del Simulador: GetStatusOperation
// =========================================================================

export async function GetStatusOperation(c: Context) {
    const requestBody: ConsultarOperacionesRequest = await c.req.json();
    const { Id } = requestBody;


    console.log('LLEGANDO GetStatusOperation:::')
    console.log('-*: ' + Id + ' :*-')
 
    if(Id === 'e63a7892-f00f-46a4-b7d1-a6e8ac7ab094') {
      return c.json<ConsultarOperacionesResponse>({
        code: 'ACCP',
        reference: '16413121',
        success: true
      }, 200);
    }

    const errorResponses = [
      {
        code: 'AB01',
        message: 'Tiempo de espera agotado',
        Id: Id // Se devuelve el mismo Id recibido
      },
      {
        code: 'AC01',
        message: 'Número de cuenta incorrecto',
        Id: Id
      },
      {
        code: 'AB07',
        message: 'Agente fuera de línea',
        Id: Id
      },
      {
        code: 'INVALID_ID',
        message: 'Formato de ID inválido o ausente',
        Id: Id || 'N/A'
   }
    ]

    // Va a retornar un elemento random del errorResponses
    const randomIndex = Math.floor(Math.random() * errorResponses.length)
    const getRandomErroResponse = errorResponses[randomIndex]

    return c.json<ConsultarOperacionesResponse>(getRandomErroResponse, 200);



    // --- Lógica de simulación basada en el 'Id' ---
    // Puedes cambiar estos IDs o añadir más para tus pruebas
    // switch (Id) {
    //   case 'e63a7892-f00f-46a4-b7d1-a6e8ac7ab094': // ID de ejemplo de éxito
    //     return c.json<ConsultarOperacionesResponse>({
    //       code: 'ACCP',
    //       reference: '16413121',
    //       success: true
    //     }, 200);
  
    //   case 'ab01-test-id-1234-error': // Simula AB01: Tiempo de espera agotado
    //     return c.json<ConsultarOperacionesResponse>({
    //       code: 'AB01',
    //       message: 'Tiempo de espera agotado',
    //       Id: Id // Se devuelve el mismo Id recibido
    //     }, 200); // Normalmente los errores de negocio pueden venir con 200 OK si el error está en el payload, o un 4xx si es un error de la petición. Asumimos 200 por tu modelo.
  
    //   case 'ab07-test-id-5678-error': // Simula AB07: Agente fuera de línea
    //     return c.json<ConsultarOperacionesResponse>({
    //       code: 'AB07',
    //       message: 'Agente fuera de línea',
    //       Id: Id
    //     }, 200);
  
    //   case 'ac01-test-id-9012-error': // Simula AC01: Número de cuenta incorrecto
    //     return c.json<ConsultarOperacionesResponse>({
    //       code: 'AC01',
    //       message: 'Número de cuenta incorrecto',
    //       Id: Id
    //     }, 200);
  
    //   // Puedes añadir más IDs o un caso por defecto para un status genérico
    //   default:
    //     // Si el ID no coincide con ninguno de los predefinidos, puedes devolver un error genérico o un "no encontrado"
    //     if (!Id || typeof Id !== 'string' || Id.length !== 36) {
    //          return c.json<ConsultarOperacionesResponse>({
    //               code: 'INVALID_ID',
    //               message: 'Formato de ID inválido o ausente',
    //               Id: Id || 'N/A'
    //          }, 400); // 400 Bad Request para un formato inválido
    //     }

    //     return c.json<ConsultarOperacionesResponse>({
    //       code: 'NOT_FOUND',
    //       message: 'Operación no encontrada para el ID proporcionado',
    //       Id: Id
    //     }, 404); // 404 Not Found si la operación no existe
    // }
  }