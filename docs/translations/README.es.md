# Pairly – Plataforma de Chat en Tiempo Real de Código Abierto (Aleatorio + Privado)

[![Licencia MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Se aceptan contribuciones](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](#contribuciones)
![PRs Bienvenidos](https://img.shields.io/badge/PRs-welcome-blue.svg)
![Estado](https://img.shields.io/badge/status-active-success)
![Hecho con React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react)
![Backend: Node](https://img.shields.io/badge/Backend-Express%20%7C%20MongoDB-brightgreen?logo=node.js)
![Issues](https://img.shields.io/github/issues/behan05/pairly)
![Forks](https://img.shields.io/github/forks/behan05/pairly)
![Stars](https://img.shields.io/github/stars/behan05/pairly)
![Último Commit](https://img.shields.io/github/last-commit/behan05/pairly)

Una aplicación de chat full-stack en tiempo real que conecta usuarios de forma anónima para mensajería privada 1-a-1. Construida con **React**, **Node.js**, **Express**, **Socket.IO** y **MongoDB**.

> **📢 Estado del Proyecto**: Este proyecto fue hecho privado previamente, pero **ahora está disponible públicamente nuevamente** como un proyecto de código abierto activamente mantenido. Estamos comprometidos con la transparencia y el desarrollo impulsado por la comunidad. Anteriormente tenía **29 estrellas** y **17 bifurcaciones**—¡gracias por su continuo apoyo!

---

## 📚 Tabla de Contenidos

- [Vista Previa](#vista-previa)
- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Instrucciones de Instalación](#instrucciones-de-instalación)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Despliegue](#despliegue)
- [Contribuciones](#contribuciones)
- [Transparencia y Confianza](#-transparencia-y-confianza)
- [Hecho por Contribuidores](#hecho-por-contribuidores)
- [Agradecimientos](#agradecimientos)
- [Contacto](#contacto)
- [Licencia](#licencia)

---

## 🖼️ Vista Previa

| Página de Login                      | Registro                              | Página Principal                    |
| ------------------------------------ | ------------------------------------- | ----------------------------------- |
| ![](/docs/screenshot/Login-page.png) | ![](/docs/screenshot/Signup-page.png) | ![](/docs/screenshot/apps-page.png) |

---

## 🚀 Características

### ✅ Características Gratuitas

- 🔐 Autenticación segura de usuarios (Login/Registro)
- 🎲 Chat privado 1-a-1 aleatorio
- 📡 Mensajería en tiempo real con Socket.IO
- 📜 Historial de chats persistente con MongoDB
- ✏️ Indicador de escritura (opcional)
- 🛡️ Rutas protegidas para usuarios autenticados
- 🕒 Mensajes con marca de tiempo
- 📱 UI completamente responsiva (Móvil y Escritorio)
- 🔔 Notificaciones básicas

### 💎 Características Premium

- ⭐ Soporte prioritario
- 🎎 Temas personalizados y personalización
- 📸 Uso compartido avanzado de medios
- 🔐 Controles de privacidad mejorados
- 📊 Analítica e información del usuario
- 🌐 Soporte de múltiples idiomas
- 📱 Instalación de aplicación PWA
- 🎵 Tonos de mensaje personalizados

---

## 📦 Requisitos Previos

Asegúrate de tener lo siguiente instalado antes de comenzar:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Git](https://git-scm.com/)
- Una cuenta de [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (o usar MongoDB local)

**¿Necesitas ayuda con MongoDB Atlas?** Sigue esta guía: [Deploy a Free Cluster](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/)

Después de desplegar el cluster:

1. Haz clic en **Connect** → **Drivers**
2. Selecciona **Node.js** como driver
3. Copia la cadena de conexión y úsala como `MONGO_URI` en `.env`

Ejemplo de cadena de conexión:

```
 MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/?retryWrites=true&w=majority
```

---

## ⚙️ Instrucciones de Instalación

Sigue estos pasos para ejecutar la app localmente:

### 1. Clonar el repositorio

```bash
git clone https://github.com/behan05/real-time-chat-app.git
cd real-time-chat-app
```

### 2. Configurar el Backend

Navega a la carpeta del servidor:

```bash
cd connect-server
```

Instala las dependencias:

```bash
npm install
```

Crea un archivo para las variables de entorno:

```bash
cp .env.example .env
```

Abre el archivo `.env` y configura:

```env
PORT=5000
MONGO_URI=tu_mongo_db_uri_aqui
JWT_SECRET=tu_jwt_secret_aqui
```

Inicia el servidor backend:

```bash
npm start
```

Deberías ver algo como:

```
Server running on port 5000...
Connected to MongoDB
```

---

### 3. Configurar el Frontend

En una nueva ventana o pestaña de terminal:

```bash
cd connect-ui
npm install
npm run dev
```

La app se abrirá en: [http://localhost:5173/](http://localhost:5173)

---

## 🧯 Solución de Problemas

Errores comunes y soluciones:

- **MongooseServerSelectionError**: Verifica tu URI de MongoDB y conexión a internet.
- **Puerto en uso**: Cambia el valor de `PORT` en `.env` o detén el proceso en conflicto.
- **El frontend no carga**: Asegúrate de que el servidor backend esté corriendo.

---

## 🧱 Stack Tecnológico

**Frontend:**

- ⚛️ React + Vite
- 💅 Material UI (MUI)
- 🔁 React Router
- 📦 Redux or Context API
- 📢 Toastify
- 🌐 Socket.IO Client

**Backend:**

- 🟩 Node.js + Express
- 🛢️ MongoDB + Mongoose
- 🔐 Autenticación con JWT
- 🔒 Hashing con bcrypt
- 📡 Socket.IO para comunicación en tiempo real

---

## 📁 Estructura del Proyecto

```
pairly/
├── pairly-ui/                          # Aplicación Frontend React
│   ├── src/
│   │   ├── api/                        # Llamadas de servicio API
│   │   ├── assets/                     # Imágenes, fuentes, activos estáticos
│   │   ├── components/                 # Componentes React reutilizables
│   │   ├── context/                    # Configuración de Context API
│   │   ├── features/                   # Módulos específicos de características
│   │   ├── layouts/                    # Componentes de diseño
│   │   ├── middleware/                 # Middleware personalizado
│   │   ├── MUI/                        # Personalizaciones de Material-UI
│   │   ├── pages/                      # Componentes de página
│   │   ├── redux/                      # Tienda Redux y slices
│   │   ├── routes/                     # Definiciones de rutas
│   │   ├── services/                   # Funciones de servicio
│   │   ├── styles/                     # Estilos globales
│   │   ├── utils/                      # Funciones de utilidad
│   │   ├── installPrompt/              # Indicador de instalación PWA
│   │   ├── SubscriptionManager/        # Gestión de suscripciones
│   │   ├── App.jsx                     # Componente principal
│   │   └── main.jsx                    # Punto de entrada
│   ├── public/
│   │   ├── manifest.json               # Manifiesto PWA
│   │   ├── robots.txt                  # Configuración de robots SEO
│   │   ├── service-worker.js           # Service worker
│   │   ├── messageTone/                # Archivos de audio de mensajes
│   │   └── sounds/                     # Efectos de sonido
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── package.json
│   └── README.md
│
├── pairly-server/                      # Aplicación Backend Express
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── settingsController.js
│   │   ├── adminPanelControllers/      # Gestión de administrador
│   │   ├── feedbackControllers/        # Retroalimentación del usuario
│   │   ├── paymentControllers/         # Procesamiento de pagos
│   │   ├── privateChatControllers/     # Lógica de chat privado
│   │   ├── randomChatControllers/      # Coincidencia de chat aleatorio
│   │   ├── searchUserControllers/      # Búsqueda de usuario
│   │   ├── support-ticket/             # Tickets de soporte
│   │   └── common/                     # Lógica de controlador compartida
│   │
│   ├── models/
│   │   ├── User.model.js               # Esquema de usuario
│   │   ├── Profile.model.js            # Perfil de usuario
│   │   ├── settings.model.js           # Configuración de usuario
│   │   ├── LoginActivity.model.js      # Seguimiento de inicio de sesión
│   │   ├── UserActivity.model.js       # Registros de actividad del usuario
│   │   ├── ReportProblem.model.js      # Reportes de problemas
│   │   ├── SupportTicket.model.js      # Tickets de soporte
│   │   ├── admin/                      # Modelos relacionados con administrador
│   │   ├── chat/                       # Modelos relacionados con chat
│   │   ├── feedback/                   # Modelos de retroalimentación
│   │   ├── payment/                    # Modelos de pago
│   │   └── proposal/                   # Modelos de propuesta
│   │
│   ├── routers/
│   │   ├── profileRoutes.js
│   │   ├── settingsRoutes.js
│   │   ├── admin/                      # Rutas de administrador
│   │   ├── auth/                       # Rutas de autenticación
│   │   ├── chat/                       # Rutas de chat
│   │   ├── feedback/                   # Rutas de retroalimentación
│   │   ├── payment/                    # Rutas de pago
│   │   └── searchUsers/                # Rutas de búsqueda
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js           # Autenticación JWT
│   │   ├── adminAuthMiddleware.js      # Autorización de administrador
│   │   ├── multerMiddleware.js         # Manejo de carga de archivos
│   │   ├── uploadPrivateMedia.js       # Carga de medios de chat privado
│   │   ├── uploadRandomMedia.js        # Carga de medios de chat aleatorio
│   │   └── uploadProfileS3.js          # Carga de perfil S3
│   │
│   ├── sockets/
│   │   ├── socketServer.js             # Configuración principal de socket
│   │   ├── privateChat/                # Eventos de socket de chat privado
│   │   └── randomChat/                 # Eventos de socket de chat aleatorio
│   │
│   ├── config/
│   │   ├── db.js                       # Conexión de MongoDB
│   │   ├── passport/                   # Estrategias OAuth
│   │   │   ├── passportGithub.js
│   │   │   └── passportGoogle.js
│   │   └── razorpay/
│   │       └── razorpay.js             # Integración de Razorpay
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── aws/                        # Utilidades AWS S3
│   │   ├── email/                      # Servicio de correo electrónico
│   │   └── socket/                     # Utilidades de socket
│   │
│   ├── cron/
│   │   ├── cleanupUnverifiedUsers.cron.js
│   │   └── deleteRandomExpiredMessages.cron.js
│   │
│   ├── tests/
│   │   ├── unit/                       # Pruebas unitarias
│   │   └── integration/                # Pruebas de integración
│   │
│   ├── server.js                       # Entrada principal del servidor
│   └── package.json
│
├── docs/
│   ├── screenshot/                     # Capturas de pantalla de la app
│   └── translations/
│       ├── README.en.md                # Documentación en inglés
│       ├── README.es.md                # Documentación en español
│       └── README.id.md                # Documentación en indonesio
│
├── CODE_OF_CONDUCT.md                  # Directrices comunitarias
├── CONTRIBUTING.md                     # Guía de contribución
├── LICENSE                             # Licencia MIT
└── README.md                           # Este archivo
```

---

## 🚀 Despliegue

- **Frontend**: [Vercel](https://connect-link-three.vercel.app/)
- **Backend**: Render

---

## 🤝 Contribuciones

### ¿Quieres contribuir?

No te preocupes si eres nuevo en open source, estaremos felices de ayudarte 😄
Simplemente abre un issue o comenta en uno que te interese.

### ¡Se aceptan contribuciones!

Si eres nuevo en open source, aquí hay algunas tareas ideales para comenzar:

### 🔧 Buenas primeras tareas:

- Mejorar mensajes de error o feedback al usuario
- Configurar GitHub Actions para CI
- Agregar pruebas unitarias o de extremo a extremo
- Mejorar la accesibilidad
- Escribir documentación

### Pasos para contribuir:

- 🌱 Haz un fork del repositorio
- 🛠️ Crea una rama para tu contribución
- 🔃 Abre un Pull Request
- ❤️ ¡Y no olvides dejar una estrella al proyecto!

Asegúrate de leer la [guia de contribución](/CONTRIBUTING.md) si está disponible.

---

## � Transparencia y Confianza

Entendemos que hacer un proyecto privado y luego hacerlo público nuevamente puede generar preocupaciones. Esto es lo que queremos que sepas:

### ¿Por qué lo hicimos privado?
- Necesitábamos tiempo para reestructurar el código y mejorar la estabilidad
- Queríamos asegurar que el proyecto estuviera listo para producción
- Estábamos evaluando el mejor camino para el mantenimiento a largo plazo

### ¿Por qué estamos de vuelta y comprometidos?
- **100% Código Abierto**: Todo el código es visible y auditable públicamente
- **Mantenimiento Activo**: El proyecto se mantiene activamente y se actualiza regularmente
- **Impulsado por la Comunidad**: Bienvenimos feedback, issues y pull requests de la comunidad
- **Hoja de Ruta Clara**: Estamos comprometidos con prácticas de desarrollo transparentes
- **Licencia MIT**: Puedes usar, modificar y distribuir este software libremente

### Hacia el Futuro
- Todo el desarrollo futuro será en abierto
- Mantendremos comunicación regular a través de issues y discusiones
- La seguridad y estabilidad son nuestras prioridades principales
- Tu feedback y contribuciones dan forma directa al futuro del proyecto

---

## �🙏 Hecho por Contribuidores

Agradecemos a todos los contribuidores que mejoran este proyecto cada día.
¡Agregate en `CONTRIBUTORS.md` cuando hagas tu primera contribución!

---

## ❤️ Agradecimientos

Gracias a todos los contribuidores y a las librerías de código abierto utilizadas en este proyecto.
¡Este proyecto no sería posible sin ellos!

---

## 📬 Contacto

¿Tienes preguntas o quieres colaborar? Siéntete libre de contactarme:
✉️ [behankrbth@outlook.com](mailto:behankrbth@outlook.com)

---

## 📄 License

Este proyecto está licenciado bajo la [Licencia MIT](/LICENSE)

---
