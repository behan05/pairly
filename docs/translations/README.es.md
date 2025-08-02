# Aplicación de Chat Aleatorio en Tiempo Real

[![Licencia MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Se aceptan contribuciones](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](#contribuciones)
![PRs Bienvenidos](https://img.shields.io/badge/PRs-welcome-blue.svg)
![Estado](https://img.shields.io/badge/status-active-success)
![Hecho con React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react)
![Backend: Node](https://img.shields.io/badge/Backend-Express%20%7C%20MongoDB-brightgreen?logo=node.js)
![Issues](https://img.shields.io/github/issues/behan05/real-time-chat-app)
![Forks](https://img.shields.io/github/forks/behan05/real-time-chat-app)
![Stars](https://img.shields.io/github/stars/behan05/real-time-chat-app)
![Último Commit](https://img.shields.io/github/last-commit/behan05/real-time-chat-app)

Una aplicación de chat aleatorio en tiempo real full-stack que conecta a usuarios anónimamente para mensajería privada 1-a-1. Construida con **React**, **Node.js**, **Express**, **Socket.IO** y **MongoDB**.

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

- 🔐 Autenticación segura de usuarios (Login/Registro)
- 🎲 Chat privado 1-a-1 aleatorio
- 📡 Mensajería en tiempo real con Socket.IO
- 📜 Historial de chats persistente con MongoDB
- ✏️ Indicador de escritura (opcional)
- 🛡️ Rutas protegidas para usuarios autenticados
- 🕒 Mensajes con marca de tiempo
- 📱 UI completamente responsiva (Móvil y Escritorio)

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
real-time-chat-app/
├── connect-ui/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── redux/ or context/
│   │   └── App.jsx
│   └── package.json
├── connect-server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   └── server.js
├── docs/
│   ├──screenshot/
│   └──translations/
├── .env
└── README.md
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

## 🙏 Hecho por Contribuidores

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
