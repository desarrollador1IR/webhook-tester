# Endpoint C2P (Código a Pago) - Simulación

Este endpoint simula el comportamiento de un sistema de pago móvil C2P (Código a Pago) con diferentes casos de éxito y error.

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
POST /R4c2p
```

## 🔧 Configuración

### Headers Requeridos
- `Content-Type: application/json`
- `Authorization: {TOKEN_HMAC_SHA256}`
- `Commerce: {TOKEN_COMERCIO}`

### Generación del Token de Autorización

El token se genera usando HMAC-SHA256:
```javascript
HMAC-SHA256(TelefonoDestino + Monto + Banco + Cedula, CommerceToken)
```

## 🧪 Pruebas

### Usando el Script de Pruebas

1. **Ejecutar todas las pruebas:**
```bash
node test-c2p.js
```

2. **Ejecutar un caso específico:**
```bash
node test-c2p.js --case 1
```

### Casos de Prueba Disponibles

| Caso | Descripción | Condición |
|------|-------------|-----------|
| 1 | Transacción Exitosa | OTP = "12345678" Y Monto = "10.00" |
| 2 | Banco Fuera de Servicio | Banco = "BANCO_FUERA", "SERVICIO_CAIDO", "MANTENIMIENTO" |
| 3 | Insuficiencia de Fondos | Monto > 1,000,000 |
| 4 | Número de Celular No Coincide | Teléfono = "0412000000", "0424000000", "0000000000" |
| 5 | Documento de Identificación Errado | Cédula = "0000000", "1234567", "9999999" |
| 6 | Llave Errónea | Commerce Token = "INVALID_TOKEN", "WRONG_KEY", "TEST_ERROR" |
| 7 | Caso Válido Aleatorio | Caso genérico (70% éxito, 30% error) |
| 8 | Teléfono Inválido | Formato incorrecto |
| 9 | Cédula Inválida | Formato incorrecto |
| 10 | Monto Inválido | Formato incorrecto |

### Usando cURL

**Ejemplo de transacción exitosa:**
```bash
curl -X POST http://localhost:3000/R4c2p \
  -H "Content-Type: application/json" \
  -H "Authorization: $(node -e "
    const crypto = require('crypto');
    const data = '04123456789' + '10.00' + 'BANESCO' + '12345678';
    const hmac = crypto.createHmac('sha256', 'mi_token_secreto');
    hmac.update(data);
    console.log(hmac.digest('hex'));
  ")" \
  -H "Commerce: mi_token_secreto" \
  -d '{
    "telefonoDestino": "04123456789",
    "monto": "10.00",
    "banco": "BANESCO",
    "cedula": "12345678",
    "otp": "12345678"
  }'
```

## 📊 Códigos de Respuesta

| Código | Mensaje | Descripción |
|--------|---------|-------------|
| 00 | TRANSACCION EXITOSA | Transacción procesada correctamente |
| 08 | TOKEN inválido | Token de autorización incorrecto |
| 15 | Llave Erronea | Token de comercio incorrecto |
| 30 | Error en formato:30 | Error en formato de datos |
| 41 | Transaccipon no permitida Banco fuera de servicio | Banco no disponible |
| 51 | Insuficiencia de Fondos | Fondos insuficientes |
| 56 | Numero de celular no coincide | Número de teléfono inválido |
| 80 | Documento de identificación errado | Cédula inválida |

## 🔍 Validaciones Implementadas

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

## 🎯 Casos Especiales

### Transacción Exitosa Garantizada
- **OTP:** "12345678"
- **Monto:** "10.00"
- **Resultado:** Siempre retorna código "00"

### Casos Aleatorios
Para casos que no coinciden con condiciones específicas:
- **70%** de probabilidad de éxito (código "00")
- **30%** de probabilidad de error aleatorio

## 📝 Logs

El endpoint registra todas las transacciones en la consola del servidor, incluyendo:
- Headers recibidos
- Datos de la transacción
- Resultado de la validación
- Respuesta enviada

## 🔒 Seguridad

- Validación HMAC-SHA256 para autenticación
- Validación de formato de datos
- Manejo seguro de errores
- Logs detallados para auditoría

## 📚 Documentación Adicional

Ver `C2P_SIMULATION_GUIDE.md` para una guía más detallada con ejemplos específicos de cada caso de prueba. 