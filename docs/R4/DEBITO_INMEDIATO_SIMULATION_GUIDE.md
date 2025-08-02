# Guía de Simulación - Débito Inmediato

Esta guía proporciona ejemplos detallados para probar todos los casos del endpoint de Débito Inmediato.

## 📋 Tabla de Contenidos

1. [Configuración Inicial](#configuración-inicial)
2. [Casos de Éxito](#casos-de-éxito)
3. [Casos de Error](#casos-de-error)
4. [Validaciones de Formato](#validaciones-de-formato)
5. [Errores de Autenticación](#errores-de-autenticación)
6. [Scripts de Prueba](#scripts-de-prueba)

## 🔧 Configuración Inicial

### Variables de Entorno
```bash
# Configurar el servidor
export SERVER_URL="http://localhost:3000"
export ENDPOINT="/R4/debito-inmediato"

# Tokens de prueba
export AUTH_TOKEN="mi_token_aqui"
export COMMERCE_KEY="mi_llave_comercio"
```

### Headers Base
```bash
HEADERS="-H 'Content-Type: application/json' \
         -H 'Authorization: $AUTH_TOKEN' \
         -H 'Commerce: $COMMERCE_KEY'"
```

## ✅ Casos de Éxito

### Caso 1: Transacción Exitosa Garantizada

**Descripción:** Transacción que siempre retorna éxito con OTP correcto y monto específico.

**Condiciones:**
- OTP = "12345678"
- Monto = "10.00"

**Comando:**
```bash
curl -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
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

**Respuesta Esperada:**
```json
{
  "code": "ACCP",
  "message": "Operación Aceptada",
  "reference": 12345678,
  "id": "uuid-generado"
}
```

### Caso 2: Operación en Espera

**Descripción:** Transacción con monto menor a 1000.00 que queda en espera.

**Condiciones:**
- Monto < 1000.00

**Comando:**
```bash
curl -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "500.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "María González",
    "OTP": "12345678",
    "Concepto": "Pago de factura"
  }'
```

**Respuesta Esperada:**
```json
{
  "code": "AC00",
  "message": "Operación en Espera de Respuesta del Receptor",
  "Id": "uuid-generado"
}
```

## ❌ Casos de Error

### Caso 3: Error por Monto Alto

**Descripción:** Transacción con monto mayor a 1000.00 que genera error aleatorio.

**Comando:**
```bash
curl -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "1500.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Carlos López",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }'
```

**Respuesta Esperada:** Error aleatorio de la lista de códigos de error

### Caso 4: OTP Incorrecto

**Descripción:** Transacción con OTP incorrecto que genera error aleatorio.

**Comando:**
```bash
curl -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Ana Rodríguez",
    "OTP": "87654321",
    "Concepto": "Pago de servicios"
  }'
```

**Respuesta Esperada:** Error aleatorio de la lista de códigos de error

## 🔍 Validaciones de Formato

### Caso 5: Banco Inválido

**Descripción:** Prueba con formato de banco incorrecto.

**Comando:**
```bash
curl -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "ABC",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Juan Pérez",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }'
```

**Respuesta Esperada:**
```json
{
  "code": "30",
  "message": "Error en formato:30"
}
```

### Caso 6: Monto con Formato Incorrecto

**Descripción:** Prueba con formato de monto incorrecto.

**Comando:**
```bash
curl -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.5",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Juan Pérez",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }'
```

**Respuesta Esperada:**
```json
{
  "code": "CH20",
  "message": "Número de decimales incorrecto",
  "Id": "uuid-generado"
}
```

### Caso 7: Teléfono Inválido

**Descripción:** Prueba con formato de teléfono incorrecto.

**Comando:**
```bash
curl -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "041234567",
    "Cedula": "V12345678",
    "Nombre": "Juan Pérez",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }'
```

**Respuesta Esperada:**
```json
{
  "code": "30",
  "message": "Error en formato:30"
}
```

### Caso 8: Cédula Inválida

**Descripción:** Prueba con formato de cédula incorrecto.

**Comando:**
```bash
curl -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "12345678",
    "Nombre": "Juan Pérez",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }'
```

**Respuesta Esperada:**
```json
{
  "code": "30",
  "message": "Error en formato:30"
}
```

### Caso 9: Nombre Muy Largo

**Descripción:** Prueba con nombre que excede 20 caracteres.

**Comando:**
```bash
curl -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Juan Carlos Pérez González de la Cruz",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }'
```

**Respuesta Esperada:**
```json
{
  "code": "BE20",
  "message": "Longitud del nombre invalida",
  "Id": "uuid-generado"
}
```

### Caso 10: OTP Inválido

**Descripción:** Prueba con formato de OTP incorrecto.

**Comando:**
```bash
curl -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Juan Pérez",
    "OTP": "123456",
    "Concepto": "Pago de servicios"
  }'
```

**Respuesta Esperada:**
```json
{
  "code": "30",
  "message": "Error en formato:30"
}
```

### Caso 11: Concepto Muy Largo

**Descripción:** Prueba con concepto que excede 30 caracteres.

**Comando:**
```bash
curl -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Juan Pérez",
    "OTP": "12345678",
    "Concepto": "Pago de servicios muy largo que excede el límite"
  }'
```

**Respuesta Esperada:**
```json
{
  "code": "30",
  "message": "Error en formato:30"
}
```

## 🔐 Errores de Autenticación

### Caso 12: Token de Autorización Faltante

**Descripción:** Prueba sin header de Authorization.

**Comando:**
```bash
curl -X POST $SERVER_URL$ENDPOINT \
  -H 'Content-Type: application/json' \
  -H 'Commerce: mi_llave_comercio' \
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

**Respuesta Esperada:**
```json
{
  "code": "08",
  "message": "TOKEN inválido"
}
```

### Caso 13: Llave de Comercio Faltante

**Descripción:** Prueba sin header de Commerce.

**Comando:**
```bash
curl -X POST $SERVER_URL$ENDPOINT \
  -H 'Content-Type: application/json' \
  -H 'Authorization: mi_token_aqui' \
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

**Respuesta Esperada:**
```json
{
  "code": "15",
  "message": "Llave Erronea"
}
```

## 📝 Scripts de Prueba

### Script de Prueba Completa

Crear archivo `test-debito-inmediato.sh`:

```bash
#!/bin/bash

SERVER_URL="http://localhost:3000"
ENDPOINT="/R4/debito-inmediato"
AUTH_TOKEN="mi_token_aqui"
COMMERCE_KEY="mi_llave_comercio"

HEADERS="-H 'Content-Type: application/json' \
         -H 'Authorization: $AUTH_TOKEN' \
         -H 'Commerce: $COMMERCE_KEY'"

echo "🧪 Iniciando pruebas del endpoint Débito Inmediato..."
echo "=================================================="

# Caso 1: Transacción Exitosa
echo "✅ Caso 1: Transacción Exitosa"
curl -s -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Juan Pérez",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }' | jq '.'
echo ""

# Caso 2: Operación en Espera
echo "⏳ Caso 2: Operación en Espera"
curl -s -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "500.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "María González",
    "OTP": "12345678",
    "Concepto": "Pago de factura"
  }' | jq '.'
echo ""

# Caso 3: Error por Monto Alto
echo "❌ Caso 3: Error por Monto Alto"
curl -s -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "1500.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Carlos López",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }' | jq '.'
echo ""

# Caso 4: OTP Incorrecto
echo "❌ Caso 4: OTP Incorrecto"
curl -s -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Ana Rodríguez",
    "OTP": "87654321",
    "Concepto": "Pago de servicios"
  }' | jq '.'
echo ""

echo "🎯 Pruebas completadas!"
```

### Script de Prueba de Validaciones

Crear archivo `test-validaciones.sh`:

```bash
#!/bin/bash

SERVER_URL="http://localhost:3000"
ENDPOINT="/R4/debito-inmediato"
AUTH_TOKEN="mi_token_aqui"
COMMERCE_KEY="mi_llave_comercio"

HEADERS="-H 'Content-Type: application/json' \
         -H 'Authorization: $AUTH_TOKEN' \
         -H 'Commerce: $COMMERCE_KEY'"

echo "🔍 Iniciando pruebas de validaciones..."
echo "====================================="

# Banco inválido
echo "❌ Banco inválido"
curl -s -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "ABC",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Juan Pérez",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }' | jq '.'
echo ""

# Monto inválido
echo "❌ Monto inválido"
curl -s -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.5",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Juan Pérez",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }' | jq '.'
echo ""

# Teléfono inválido
echo "❌ Teléfono inválido"
curl -s -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "041234567",
    "Cedula": "V12345678",
    "Nombre": "Juan Pérez",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }' | jq '.'
echo ""

# Cédula inválida
echo "❌ Cédula inválida"
curl -s -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "12345678",
    "Nombre": "Juan Pérez",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }' | jq '.'
echo ""

# Nombre muy largo
echo "❌ Nombre muy largo"
curl -s -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Juan Carlos Pérez González de la Cruz",
    "OTP": "12345678",
    "Concepto": "Pago de servicios"
  }' | jq '.'
echo ""

# OTP inválido
echo "❌ OTP inválido"
curl -s -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Juan Pérez",
    "OTP": "123456",
    "Concepto": "Pago de servicios"
  }' | jq '.'
echo ""

# Concepto muy largo
echo "❌ Concepto muy largo"
curl -s -X POST $SERVER_URL$ENDPOINT \
  $HEADERS \
  -d '{
    "Banco": "0102",
    "Monto": "10.00",
    "Telefono": "04123456789",
    "Cedula": "V12345678",
    "Nombre": "Juan Pérez",
    "OTP": "12345678",
    "Concepto": "Pago de servicios muy largo que excede el límite"
  }' | jq '.'
echo ""

echo "🎯 Pruebas de validaciones completadas!"
```

## 🚀 Ejecución de Scripts

### Dar permisos de ejecución:
```bash
chmod +x test-debito-inmediato.sh
chmod +x test-validaciones.sh
```

### Ejecutar pruebas:
```bash
# Pruebas principales
./test-debito-inmediato.sh

# Pruebas de validaciones
./test-validaciones.sh
```

## 📊 Resumen de Casos de Prueba

| Caso | Descripción | Condición | Código Esperado |
|------|-------------|-----------|-----------------|
| 1 | Transacción Exitosa | OTP="12345678" Y Monto="10.00" | ACCP |
| 2 | Operación en Espera | Monto < 1000.00 | AC00 |
| 3 | Error por Monto Alto | Monto > 1000.00 | Aleatorio |
| 4 | OTP Incorrecto | OTP ≠ "12345678" | Aleatorio |
| 5 | Banco Inválido | Formato incorrecto | 30 |
| 6 | Monto Inválido | Formato incorrecto | CH20 |
| 7 | Teléfono Inválido | Formato incorrecto | 30 |
| 8 | Cédula Inválida | Formato incorrecto | 30 |
| 9 | Nombre Muy Largo | > 20 caracteres | BE20 |
| 10 | OTP Inválido | Formato incorrecto | 30 |
| 11 | Concepto Muy Largo | > 30 caracteres | 30 |
| 12 | Sin Authorization | Header faltante | 08 |
| 13 | Sin Commerce | Header faltante | 15 |

## 📚 Notas Adicionales

1. **UUIDs Únicos:** Cada respuesta incluye un ID único generado automáticamente
2. **Referencias:** Las transacciones exitosas incluyen una referencia aleatoria de 8 dígitos
3. **Errores Aleatorios:** Los errores se seleccionan de una lista predefinida de códigos
4. **Validaciones Estrictas:** Todos los campos tienen validaciones de formato específicas
5. **Headers Obligatorios:** Authorization y Commerce son requeridos para todas las operaciones
6. **Logs Detallados:** El endpoint registra todas las transacciones en la consola del servidor 