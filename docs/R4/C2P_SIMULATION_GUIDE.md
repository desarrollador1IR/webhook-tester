# Guía de Simulación C2P (Código a Pago)

## Endpoint
```
POST /R4c2p
```

## Headers Requeridos
- `Content-Type: application/json`
- `Authorization: {TOKEN_HMAC_SHA256}`
- `Commerce: {TOKEN_COMERCIO}`

## Generación del Token de Autorización

El token se genera usando HMAC-SHA256 con la siguiente fórmula:
```
HMAC-SHA256(TelefonoDestino + Monto + Banco + Cedula, CommerceToken)
```

### Ejemplo de generación en JavaScript:
```javascript
const crypto = require('crypto');

function generateAuthToken(telefonoDestino, monto, banco, cedula, commerceToken) {
    const dataToHash = `${telefonoDestino}${monto}${banco}${cedula}`;
    const hmac = crypto.createHmac('sha256', commerceToken);
    hmac.update(dataToHash);
    return hmac.digest('hex');
}

// Ejemplo de uso:
const token = generateAuthToken('04123456789', '10.00', 'BANESCO', '12345678', 'mi_token_secreto');
```

## Casos de Prueba

### 1. Transacción Exitosa (Código 00)
**Condición:** OTP = "12345678" Y Monto = "10.00"

```bash
curl -X POST http://localhost:3000/R4c2p \
  -H "Content-Type: application/json" \
  -H "Authorization: {TOKEN_GENERADO}" \
  -H "Commerce: mi_token_secreto" \
  -d '{
    "telefonoDestino": "04123456789",
    "monto": "10.00",
    "banco": "BANESCO",
    "cedula": "12345678",
    "otp": "12345678"
  }'
```

**Respuesta:**
```json
{
  "message": "TRANSACCION EXITOSA",
  "code": "00",
  "reference": "12345678"
}
```

### 2. Banco Fuera de Servicio (Código 41)
**Condición:** Banco = "BANCO_FUERA", "SERVICIO_CAIDO", o "MANTENIMIENTO"

```bash
curl -X POST http://localhost:3000/R4c2p \
  -H "Content-Type: application/json" \
  -H "Authorization: {TOKEN_GENERADO}" \
  -H "Commerce: mi_token_secreto" \
  -d '{
    "telefonoDestino": "04123456789",
    "monto": "50.00",
    "banco": "BANCO_FUERA",
    "cedula": "12345678"
  }'
```

**Respuesta:**
```json
{
  "code": "41",
  "message": "Transaccipon no permitida Banco fuera de servicio"
}
```

### 3. Insuficiencia de Fondos (Código 51)
**Condición:** Monto > 1,000,000

```bash
curl -X POST http://localhost:3000/R4c2p \
  -H "Content-Type: application/json" \
  -H "Authorization: {TOKEN_GENERADO}" \
  -H "Commerce: mi_token_secreto" \
  -d '{
    "telefonoDestino": "04123456789",
    "monto": "2000000.00",
    "banco": "BANESCO",
    "cedula": "12345678"
  }'
```

**Respuesta:**
```json
{
  "code": "51",
  "message": "Insuficiencia de Fondos"
}
```

### 4. Número de Celular No Coincide (Código 56)
**Condición:** Teléfono = "0412000000", "0424000000", o "0000000000"

```bash
curl -X POST http://localhost:3000/R4c2p \
  -H "Content-Type: application/json" \
  -H "Authorization: {TOKEN_GENERADO}" \
  -H "Commerce: mi_token_secreto" \
  -d '{
    "telefonoDestino": "0412000000",
    "monto": "50.00",
    "banco": "BANESCO",
    "cedula": "12345678"
  }'
```

**Respuesta:**
```json
{
  "code": "56",
  "message": "Numero de celular no coincide"
}
```

### 5. Documento de Identificación Errado (Código 80)
**Condición:** Cédula = "0000000", "1234567", o "9999999"

```bash
curl -X POST http://localhost:3000/R4c2p \
  -H "Content-Type: application/json" \
  -H "Authorization: {TOKEN_GENERADO}" \
  -H "Commerce: mi_token_secreto" \
  -d '{
    "telefonoDestino": "04123456789",
    "monto": "50.00",
    "banco": "BANESCO",
    "cedula": "0000000"
  }'
```

**Respuesta:**
```json
{
  "code": "80",
  "message": "Documento de identificación errado"
}
```

### 6. Llave Errónea (Código 15)
**Condición:** Commerce Token = "INVALID_TOKEN", "WRONG_KEY", o "TEST_ERROR"

```bash
curl -X POST http://localhost:3000/R4c2p \
  -H "Content-Type: application/json" \
  -H "Authorization: {TOKEN_GENERADO}" \
  -H "Commerce: INVALID_TOKEN" \
  -d '{
    "telefonoDestino": "04123456789",
    "monto": "50.00",
    "banco": "BANESCO",
    "cedula": "12345678"
  }'
```

**Respuesta:**
```json
{
  "code": "15",
  "message": "Llave Erronea"
}
```

### 7. TOKEN Inválido (Código 08)
**Condición:** Token de autorización incorrecto o faltante

```bash
curl -X POST http://localhost:3000/R4c2p \
  -H "Content-Type: application/json" \
  -H "Authorization: token_invalido" \
  -H "Commerce: mi_token_secreto" \
  -d '{
    "telefonoDestino": "04123456789",
    "monto": "50.00",
    "banco": "BANESCO",
    "cedula": "12345678"
  }'
```

**Respuesta:**
```json
{
  "code": "08",
  "message": "TOKEN inválido"
}
```

### 8. Error en Formato (Código 30)
**Condición:** Content-Type incorrecto, campos faltantes, o formato inválido

```bash
curl -X POST http://localhost:3000/R4c2p \
  -H "Content-Type: text/plain" \
  -H "Authorization: {TOKEN_GENERADO}" \
  -H "Commerce: mi_token_secreto" \
  -d '{
    "telefonoDestino": "04123456789",
    "monto": "50.00",
    "banco": "BANESCO",
    "cedula": "12345678"
  }'
```

**Respuesta:**
```json
{
  "code": "30",
  "message": "Error en formato:30"
}
```

## Validaciones Implementadas

### Formato de Teléfono
- Debe ser un número venezolano válido
- Patrón: `^0[24]\d{9}$`
- Ejemplos válidos: "04123456789", "04241234567"

### Formato de Cédula
- Debe ser un número de 7 u 8 dígitos
- Patrón: `^\d{7,8}$`
- Ejemplos válidos: "12345678", "1234567"

### Formato de Monto
- Debe ser un número decimal válido
- Patrón: `^\d+(\.\d{1,2})?$`
- Ejemplos válidos: "10.00", "50", "100.50"

## Casos Aleatorios

Para casos que no coinciden con ninguna condición específica, el sistema:
- Retorna éxito (código 00) con 70% de probabilidad
- Retorna un error aleatorio con 30% de probabilidad

## Códigos de Error Disponibles

| Código | Mensaje |
|--------|---------|
| 00 | TRANSACCION EXITOSA |
| 08 | TOKEN inválido |
| 15 | Llave Erronea |
| 30 | Error en formato:30 |
| 41 | Transaccipon no permitida Banco fuera de servicio |
| 51 | Insuficiencia de Fondos |
| 56 | Numero de celular no coincide |
| 80 | Documento de identificación errado | 