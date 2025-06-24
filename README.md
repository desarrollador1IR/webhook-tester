# Webhook Tester - Uso Interno de Equipo

Microservicio Node.js para pruebas y validación de webhooks de transacciones. Este proyecto está diseñado para ser utilizado y mantenido por el equipo interno de Integraciones.

---

## 🛠️ Stack Tecnológico

- **Node.js** (TypeScript)
- **Hono** (framework web ultrarrápido)
- **Drizzle ORM** (ORM para bases de datos SQL)
- **SQLite** (base de datos local)
- **Zod** (validación de esquemas)
- **dotenv** (carga de variables de entorno)
- **pnpm** (gestor de paquetes)

---

## 📋 Descripción

Este microservicio expone endpoints HTTP para recibir webhooks de transacciones, verificar su autenticidad mediante HMAC SHA256 y (opcionalmente) almacenar los datos en una base de datos SQLite. Es ideal para pruebas de integraciones de pagos, simulación de callbacks y validación de firmas.

---

## 🚀 Cómo correr el proyecto

### 1. Clona el repositorio

```bash
git clone <URL_DEL_REPO>
cd webhook-tester
```

### 2. Instala las dependencias

```bash
pnpm install
```

### 3. Configura las variables de entorno

Copia el archivo `.env.example` a `.env` y completa los valores necesarios:

```bash
cp .env.example .env
```

#### Variables requeridas:

| Variable                | Descripción                                              | Ejemplo                        |
|-------------------------|---------------------------------------------------------|--------------------------------|
| `PORT`                  | Puerto en el que se ejecuta el servidor                 | 3990                           |
| `DATABASE_URL`          | URL de conexión a la base de datos SQLite               | file:./data/dev.sqlite         |
| `WEBHOOK_SECRET_KEY`    | Secreto HMAC para verificar la firma de los webhooks    | supersecreto123                |

### 4. Migraciones de base de datos

Si usas Drizzle ORM, ejecuta las migraciones (opcional según tu flujo):

```bash
pnpm db:migrate
```

### 5. Ejecuta en modo desarrollo

```bash
pnpm dev
```

El servidor estará disponible en:  
[http://localhost:3990](http://localhost:3990) (o el puerto que definas)

### 6. Compila y ejecuta en producción

```bash
pnpm build
pnpm start
```

---

## 📦 Endpoints principales

- `GET /`  
  Responde con un mensaje de salud ("Hello Hono! Webhook receiver is ready.")

- `POST /webhook/transaction`  
  Recibe webhooks de transacciones, verifica la firma HMAC y procesa el payload.

---

## 🔒 Seguridad

- La verificación de la firma HMAC SHA256 es obligatoria para aceptar webhooks.
- El secreto debe coincidir exactamente con el usado por el emisor del webhook.

---

## 🧪 Pruebas

Puedes usar herramientas como Hoppscotch o Postman para enviar peticiones al endpoint `/webhook/transaction` con el header `X-Webhook-Signature` y el cuerpo adecuado.

---

## 📁 Estructura del proyecto

```
webhook-tester/
├── src/
│   ├── config/
│   │   └── env.ts         # Validación de variables de entorno
│   ├── db/
│   │   ├── db.ts          # Configuración de la base de datos
│   │   └── schema.ts      # Esquema de la base de datos
│   └── index.ts           # Punto de entrada principal
├── data/
│   └── dev.sqlite         # Base de datos SQLite (desarrollo)
├── .env.example           # Ejemplo de variables de entorno
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📝 Licencia

Uso interno exclusivo. No distribuir fuera de la organización.

---