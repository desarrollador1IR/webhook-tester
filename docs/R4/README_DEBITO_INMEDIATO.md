# Endpoint Débito Inmediato - Simulación

Este endpoint simula el comportamiento de un sistema de débito inmediato bancario con diferentes casos de éxito y error, incluyendo validaciones específicas para cada campo.

## 🚀 Instalación

1. Instalar dependencias:
```bash
pnpm install
```

2. Iniciar el servidor:
```bash
pnpm dev
```

El servidor estará disponible en `http://localhost:3000`

## 📋 Endpoint

```
POST /R4/debito-inmediato
```

## 🔧 Configuración

### Headers Requeridos
- `Content-Type: application/json`
- `Authorization: {TOKEN}`
- `Commerce: {LLAVE_COMERCIO}`

## 📝 Estructura de la Solicitud

### Campos Requeridos

| Campo | Tipo | Formato | Descripción |
|-------|------|---------|-------------|
| `Banco` | string | `^\d{4}$` | Código de 4 dígitos del banco |
| `Monto` | string | `^\d{1,8}\.\d{2}$` | Monto con exactamente 2 decimales |
| `Telefono` | string | `^\d{11}$` | Número de teléfono de 11 dígitos |
| `Cedula` | string | `^[VEJG]\d{8}$` | Cédula (V/E/J/G + 8 dígitos) |
| `Nombre` | string | `max 20 chars` | Nombre del titular (máximo 20 caracteres) |
| `OTP` | string | `^\d{8}$` | Código OTP de 8 dígitos |
| `Concepto` | string | `max 30 chars` | Concepto del pago (máximo 30 caracteres) |

### Ejemplo de Solicitud

```json
{
  "Banco": "0102",
  "Monto": "10.00",
  "Telefono": "04123456789",
  "Cedula": "V12345678",
  "Nombre": "Juan Pérez",
  "OTP": "12345678",
  "Concepto": "Pago de servicios"
}
```

## 🧪 Casos de Prueba

### Caso 1: Transacción Exitosa
**Condiciones:**
- OTP = "12345678"
- Monto = "10.00"

**Respuesta:**
```json
{
  "code": "ACCP",
  "message": "Operación Aceptada",
  "reference": 12345678,
  "id": "uuid-generado"
}
```

### Caso 2: Operación en Espera
**Condiciones:**
- Monto < 1000.00

**Respuesta:**
```json
{
  "code": "AC00",
  "message": "Operación en Espera de Respuesta del Receptor",
  "Id": "uuid-generado"
}
```

### Caso 3: Error por Monto Alto
**Condiciones:**
- Monto > 1000.00

**Respuesta:** Error aleatorio de la lista de códigos de error

### Caso 4: OTP Incorrecto
**Condiciones:**
- OTP ≠ "12345678"

**Respuesta:** Error aleatorio de la lista de códigos de error

## 📊 Códigos de Respuesta

### Códigos de Éxito

| Código | Mensaje | Descripción |
|--------|---------|-------------|
| ACCP | Operación Aceptada | Transacción procesada correctamente |
| AC00 | Operación en Espera de Respuesta del Receptor | Transacción en proceso de validación |

### Códigos de Error de Autenticación

| Código | Mensaje | Descripción |
|--------|---------|-------------|
| 08 | TOKEN inválido | Token de autorización incorrecto |
| 15 | Llave Erronea | Token de comercio incorrecto |

### Códigos de Error de Validación

| Código | Mensaje | Descripción |
|--------|---------|-------------|
| 30 | Error en formato:30 | Error en formato de datos |
| CH20 | Número de decimales incorrecto | Formato de monto inválido |
| BE20 | Longitud del nombre invalida | Nombre excede 20 caracteres |

### Códigos de Error Aleatorios

| Código | Mensaje | Descripción |
|--------|---------|-------------|
| AB01 | Tiempo de espera agotado | Timeout en la operación |
| AB07 | Agente fuera de línea | Sistema no disponible |
| AC01 | Número de cuenta incorrecto | Cuenta inválida |
| AC04 | Cuenta cancelada | Cuenta inactiva |
| AC06 | Cuenta bloqueada | Cuenta suspendida |
| AC09 | Moneda no válida | Moneda no soportada |
| AG01 | Transacción Restringida | Operación no permitida |
| AG09 | Pago no recibido | Pago rechazado |
| AG10 | Agente suspendido o excluido | Agente inactivo |
| AM02 | Monto de la transacción no permitido | Monto fuera de límites |
| AM04 | Saldo insuficiente | Fondos insuficientes |
| AM05 | Operación duplicada | Transacción duplicada |
| BE01 | Datos del cliente no corresponden a la cuenta | Datos inconsistentes |
| CUST | Cancelación solicitada por el deudor | Cancelado por usuario |
| DS02 | Operación Cancelada | Transacción cancelada |
| DT03 | Fecha de procesamiento no bancaria no válida | Fecha inválida |

## 🔍 Validaciones Implementadas

### Validación de Banco
- **Formato:** 4 dígitos numéricos
- **Patrón:** `^\d{4}$`
- **Ejemplos válidos:** "0102", "0104", "0105"

### Validación de Monto
- **Formato:** Número decimal con exactamente 2 decimales
- **Patrón:** `^\d{1,8}\.\d{2}$`
- **Ejemplos válidos:** "10.00", "100.50", "1000.00"

### Validación de Teléfono
- **Formato:** 11 dígitos numéricos
- **Patrón:** `^\d{11}$`
- **Ejemplos válidos:** "04123456789", "04241234567"

### Validación de Cédula
- **Formato:** Letra (V/E/J/G) + 8 dígitos
- **Patrón:** `^[VEJG]\d{8}$`
- **Ejemplos válidos:** "V12345678", "E87654321", "J11223344"

### Validación de Nombre
- **Longitud máxima:** 20 caracteres
- **Ejemplos válidos:** "Juan Pérez", "María González"

### Validación de OTP
- **Formato:** 8 dígitos numéricos
- **Patrón:** `^\d{8}$`
- **Ejemplos válidos:** "12345678", "87654321"

### Validación de Concepto
- **Longitud máxima:** 30 caracteres
- **Ejemplos válidos:** "Pago de servicios", "Compra en línea"

## 🎯 Casos Especiales

### Transacción Exitosa Garantizada
- **OTP:** "12345678"
- **Monto:** "10.00"
- **Resultado:** Siempre retorna código "ACCP" con referencia

### Operación en Espera
- **Condición:** Monto < 1000.00
- **Resultado:** Código "AC00" (en espera de respuesta)

### Errores Aleatorios
Para casos que no coinciden con condiciones específicas:
- **Monto > 1000.00:** Error aleatorio
- **OTP incorrecto:** Error aleatorio
- **Otros casos:** Error aleatorio

## 📝 Logs

El endpoint registra todas las transacciones en la consola del servidor, incluyendo:
- Headers recibidos
- Datos de la transacción
- Resultado de las validaciones
- Respuesta enviada
- Errores de procesamiento

## 🔒 Seguridad

- Validación de headers de autorización
- Validación estricta de formato de datos
- Manejo seguro de errores
- Logs detallados para auditoría
- Generación de UUIDs únicos para cada transacción

## 🧪 Pruebas con cURL

### Ejemplo de Transacción Exitosa
```bash
curl -X POST http://localhost:3000/R4/debito-inmediato \
  -H "Content-Type: application/json" \
  -H "Authorization: mi_token_aqui" \
  -H "Commerce: mi_llave_comercio" \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Juan Pérez",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }'
```

### Ejemplo de Operación en Espera
```bash
curl -X POST http://localhost:3000/R4/debito-inmediato \
  -H "Content-Type: application/json" \
  -H "Authorization: mi_token_aqui" \
  -H "Commerce: mi_llave_comercio" \
  -d '{
    "Banco": "0102",
    "Monto": "500.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Juan Pérez",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }'
```

### Ejemplo de Error por OTP Incorrecto
```bash
curl -X POST http://localhost:3000/R4/debito-inmediato \
  -H "Content-Type: application/json" \
  -H "Authorization: mi_token_aqui" \
  -H "Commerce: mi_llave_comercio" \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Juan Pérez",
    "OTP": "87654321",
    "Concepto": "Pago de servicios"
  }'
```

## 📚 Notas Importantes

1. **UUIDs Únicos:** Cada respuesta incluye un ID único generado con `crypto.randomUUID()`
2. **Referencias:** Las transacciones exitosas incluyen una referencia aleatoria de 8 dígitos
3. **Errores Aleatorios:** Los errores se seleccionan aleatoriamente de una lista predefinida
4. **Validaciones Estrictas:** Todos los campos tienen validaciones de formato específicas
5. **Headers Obligatorios:** Authorization y Commerce son requeridos para todas las operaciones 