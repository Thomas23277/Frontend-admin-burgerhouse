# 🛠️ Burger House — Frontend Admin

Panel de administración y empleados de **Burger House**. CRUD completo de productos, categorías, ingredientes, pedidos y usuarios. Consume la API de `burger-house-backend`.

## 🎥 Video de Presentación

**Link del video:** _[https://youtu.be/YCxig3wu1N4?feature=shared]_

---

## 🛠️ Tecnologías

- **React 18** — Biblioteca de interfaces
- **Vite 8** — Build tool (Rolldown)
- **TanStack Query** — Server state (caché, sync, mutations)
- **React Router** — Navegación SPA con protección por roles
- **Axios** — Cliente HTTP con interceptor
- **Tailwind CSS** — Estilos

## 🚀 Ejecución

### Requisitos

- Node.js 20+
- npm 10+

### Instalación

```bash
cd Frontend-admin-burgerhouse
npm install

# Copiar y revisar variables de entorno (opcional, defaults funcionan con proxy)
copy .env.example .env
```

### Ejecutar desarrollo (con proxy al backend)

```bash
# Backend debe estar corriendo en http://localhost:8000
npm run dev
```

### Build producción

```bash
npm run build
```

Disponible en: http://localhost:5174

## 📁 Páginas

| Ruta | Página | Roles |
|------|--------|-------|
| `/admin` | Dashboard | ADMIN |
| `/admin/productos` | CRUD Productos | ADMIN, STOCK |
| `/admin/categorias` | CRUD Categorías | ADMIN, STOCK |
| `/admin/ingredientes` | CRUD Ingredientes | ADMIN, STOCK |
| `/admin/pedidos` | Gestión de pedidos con FSM | ADMIN, PEDIDOS |
| `/admin/usuarios` | CRUD Usuarios | ADMIN |
| `/empleado` | Panel empleado | PEDIDOS, STOCK |
| `/login` | Inicio de sesión | Público |

## 🧠 Gestión de Pedidos

El panel de pedidos implementa la máquina de estados:

```
pendiente → confirmado → en_prep → entregado
    ↓           ↓           ↓
 cancelado   cancelado   cancelado
```

- **Transiciones inválidas** son rechazadas por el backend con 400
- **Estados terminales** (entregado, cancelado) no pueden modificarse

## 🔐 Roles

| Rol | Código | Acceso |
|-----|--------|--------|
| Administrador | ADMIN | Todo el panel |
| Gestor de Stock | STOCK | Productos, categorías, ingredientes |
| Gestor de Pedidos | PEDIDOS | Pedidos |
| Cliente | CLIENT | Sin acceso al admin |

## 👤 Credenciales de Prueba

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| `admin` | `admin@burger.com` | `Admin123!` | ADMIN (acceso completo) |

> Los usuarios se crean automáticamente via seed en el backend al iniciarlo.

## 🌐 Variables de Entorno

Ver `.env.example`:

| Variable | Default | Descripción |
|----------|---------|-------------|
| `VITE_API_URL` | `/api/v1` | URL base de la API |
