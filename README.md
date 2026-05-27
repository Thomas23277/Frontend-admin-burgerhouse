# 🛠️ Burger House — Frontend Admin

Panel de administración y empleados de **Burger House**. CRUD completo de productos, categorías, ingredientes, pedidos y usuarios. Consume la API de `burger-house-backend`.

## 🎥 Video de Presentación

**Link del video:** _[PENDIENTE — agregar link de YouTube cuando esté subido]_

---

## 🛠️ Tecnologías

- **React 18** — Biblioteca de interfaces
- **Vite** — Build tool
- **TanStack Query** — Server state (caché, sync, mutations)
- **React Router** — Navegación SPA con protección por roles
- **Axios** — Cliente HTTP con interceptor
- **Tailwind CSS** — Estilos

## 👤 Credenciales de Prueba

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| `admin` | `admin@burger.com` | `Admin123!` | ADMIN (acceso completo) |

> Los usuarios se crean automáticamente via seed en el backend al iniciarlo.

## 🚀 Ejecución

```bash
cd frontend-admin
npm install
npm run dev
```

Disponible en: http://localhost:5173

## 📁 Páginas

| Ruta | Página | Roles |
|------|--------|-------|
| `/admin` | Dashboard | ADMIN |
| `/admin/productos` | CRUD Productos | ADMIN, STOCK |
| `/admin/categorias` | CRUD Categorías | ADMIN, STOCK |
| `/admin/ingredientes` | CRUD Ingredientes | ADMIN, STOCK |
| `/admin/pedidos` | Gestión de pedidos | ADMIN, PEDIDOS |
| `/admin/usuarios` | CRUD Usuarios | ADMIN |
| `/empleado` | Panel empleado | PEDIDOS, STOCK |
| `/login` | Inicio de sesión | Público |
