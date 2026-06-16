# 🍔 Burger House — Food Store

> Proyecto Integrador — Programación 4 — TUP

Sistema de gestión de restaurante de hamburguesas con **FastAPI** (backend) + **React + TypeScript** (frontend).<br>
Incluye catálogo de productos, carrito de compras, checkout con MercadoPago, panel de administración, 
gestión de pedidos con máquina de estados, variantes de producto, y notificaciones en tiempo real vía WebSocket.

---

## 📦 Stack Tecnológico

| Capa         | Tecnología                                               |
|-------------|----------------------------------------------------------|
| Backend      | Python 3.14, FastAPI, SQLModel, Pydantic v2             |
| Frontend     | React 19, TypeScript 5 (strict), Vite 8, Tailwind CSS 4 |
| Estado Global | Zustand 5                                                |
| Datos        | PostgreSQL (producción) / SQLite (desarrollo)            |
| Pagos        | MercadoPago Checkout PRO (SDK Python + CardPayment)     |
| Imágenes     | Cloudinary (CDN + upload signed)                        |
| Tiempo Real  | WebSocket nativo FastAPI                                 |
| Tests        | pytest + TestClient (httpx)                              |

---

## 🚀 Setup Rápido

### Requisitos

- Python 3.12+
- Node.js 22+
- pnpm (recomendado) o npm
- PostgreSQL 16+ (opcional, default SQLite)

### 1. Backend

```bash
# Ir al directorio del backend
cd Backend-burgerhouse

# Crear entorno virtual
python -m venv venv

# Activar (Windows)
.\venv\Scripts\Activate.ps1
# Activar (Linux/Mac)
# source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Copiar y editar:
cp .env.example .env
# Editar .env con tus credenciales (ver sección de configuración)

# Iniciar servidor (desarrollo con recarga automática)
uvicorn app.main:app --reload --port 8000
```

El backend arranca en **http://localhost:8000**.
- Documentación interactiva: http://localhost:8000/docs (Swagger UI)
- Documentación alternativa: http://localhost:8000/redoc

Al iniciar por primera vez:
1. Crea todas las tablas automáticamente (`create_all()`)
2. Ejecuta el seed de datos (idempotente): roles, estados de pedido, formas de pago, unidades de medida, usuario admin, categorías, ingredientes y productos de ejemplo

### 2. Frontend — Store (Clientes)

```bash
cd Frontend-store-burgerhouse
pnpm install   # o npm install
pnpm dev       # o npm run dev
```

Arranca en **http://localhost:5173**.

### 3. Frontend — Admin (Gestión)

```bash
cd Frontend-admin-burgerhouse
pnpm install   # o npm install
pnpm dev       # o npm run dev
```

Arranca en **http://localhost:5174**.

> ⚠️ Ambos frontends usan proxy de Vite para comunicarse con el backend en `:8000`.
> No es necesario configurar `VITE_API_URL` a menos que el backend esté en otro host/puerto.

---

### Frontend — `.env`

| Variable        | Descripción                                    | Default                        |
|----------------|------------------------------------------------|-------------------------------|
| `VITE_API_URL` | URL base del backend (solo si no usa proxy)    | `http://localhost:8000/api/v1`|
| `VITE_WS_URL`  | URL del WebSocket (solo si no usa proxy)       | `ws://localhost:8000/ws`      |

---

## 🧪 Tests

```bash
cd Backend-burgerhouse
pytest -v                    # Todos los tests
pytest -v --cov=app          # Con cobertura
pytest tests/test_pedidos.py # Tests de un módulo específico
```

Los tests usan **SQLite in-memory** para velocidad.

---

## 📡 WebSocket

El sistema usa WebSocket para notificaciones en tiempo real.

**Conexión:**
```
ws://localhost:8000/ws?token=<jwt_token>
```

El token JWT se obtiene al hacer login y se envía como query param.

**Eventos:**
| Evento                     | Descripción                          | Destino     |
|---------------------------|--------------------------------------|-------------|
| `pedido_estado`           | Cambio de estado de un pedido        | Dueño + Admin |
| `nuevo_pedido`            | Nuevo pedido creado                  | Admin       |
| `producto_creado`         | Producto creado                     | Todos       |
| `producto_actualizado`    | Producto actualizado                 | Todos       |
| `producto_eliminado`      | Producto eliminado                   | Todos       |
| `categoria_creada`        | Categoría creada                     | Todos       |
| `categoria_actualizada`   | Categoría actualizada                | Todos       |
| `categoria_eliminada`     | Categoría eliminada                  | Todos       |
| `usuario_rol_actualizado` | Cambio de rol de usuario             | Admin       |

---

## 🧠 Arquitectura

### Backend — Capas

```
Router (endpoint) → Service (lógica) → Repository (BD)
                        ↕
                   Unit of Work (transacción)
                        ↕
                    SQLModel (modelo)
```

### Frontend — Store

```
pages/ → components/ → hooks/ → store/ (Zustand)
                                 → services/ (API calls)
                                 → types/ (TypeScript)
```

### Máquina de Estados — Pedidos

```
PENDIENTE → CONFIRMADO → EN_PREP → ENTREGADO (terminal)
    ↓            ↓           ↓
 CANCELADO    CANCELADO   CANCELADO (terminal)
```

---

## 👥 Roles del Sistema

| Rol       | Código    | Acceso                                      |
|-----------|-----------|---------------------------------------------|
| Admin     | `admin`   | CRUD completo: usuarios, productos, pedidos |
| Stock     | `stock`   | Productos, stock, ingredientes              |
| Pedidos   | `pedidos` | Pedidos, historial, avanzar estados         |
| Cliente   | `cliente` | Catálogo, carrito, pedidos propios          |

### Usuario por defecto (seed)

| Email              | Password    | Rol   |
|--------------------|-------------|-------|
| admin@burger.com   | Admin123!   | admin |

---

## 📁 Estructura del Proyecto

```
BURGER-HOUSE-INTEGRADOR FINAL/
├── Backend-burgerhouse/           # Backend FastAPI
│   ├── app/
│   │   ├── auth/                  # Autenticación (register, login, me)
│   │   ├── categorias/            # CRUD categorías
│   │   ├── cloudinary/            # Upload/destroy imágenes
│   │   ├── core/                  # UoW, security, dependencies, ratelimit
│   │   ├── direcciones/           # Direcciones de entrega
│   │   ├── estadisticas/          # KPIs y métricas (admin)
│   │   ├── ingredientes/          # CRUD ingredientes
│   │   ├── mercadopago/           # Integración MercadoPago
│   │   ├── pagos/                 # Gestión de pagos
│   │   ├── pedidos/               # Pedidos + FSM + historial
│   │   ├── productos/             # Productos + variantes
│   │   ├── unidad_medida/         # Catálogo unidades de medida
│   │   ├── usuarios/              # CRUD usuarios + roles
│   │   ├── websocket/             # WS Manager + endpoint
│   │   ├── database.py            # Configuración BD
│   │   ├── main.py                # Punto de entrada FastAPI
│   │   ├── models.py              # Modelos SQLModel
│   │   └── seed.py                # Seed data (idempotente)
│   ├── alembic/                   # Migraciones (futuro)
│   ├── tests/                     # Tests pytest
│   └── requirements.txt
├── Frontend-store-burgerhouse/    # Store (clientes) — :5173
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── routes/
│       ├── services/              # API calls (axios)
│       ├── store/                 # Zustand stores
│       └── types/
└── Frontend-admin-burgerhouse/    # Admin panel — :5174
    └── src/[misma estructura]
```

---

## 📊 Endpoints Principales

| Método | Endpoint                              | Auth         | Descripción                       |
|--------|---------------------------------------|--------------|-----------------------------------|
| POST   | `/api/v1/auth/register`               | No           | Registro de usuario               |
| POST   | `/api/v1/auth/login`                  | No (RL)      | Inicio de sesión                  |
| GET    | `/api/v1/auth/me`                     | Bearer       | Datos del usuario actual          |
| GET    | `/api/v1/productos`                   | Público      | Listar productos (filtros)        |
| GET    | `/api/v1/productos/{id}`              | Público      | Detalle de producto               |
| POST   | `/api/v1/productos`                   | Admin        | Crear producto                    |
| POST   | `/api/v1/pedidos`                     | Cliente      | Crear pedido                      |
| PATCH  | `/api/v1/pedidos/{id}/estado`         | Admin/PEDIDOS| Avanzar estado (FSM)              |
| POST   | `/api/v1/mercadopago/create-preference`| Cliente/Admin| Crear preferencia de pago MP     |
| POST   | `/api/v1/mercadopago/webhook`         | Público*     | Webhook IPN MercadoPago           |
| GET    | `/api/v1/estadisticas/*`              | Admin        | KPIs y métricas del negocio       |
| WS     | `/ws?token=`                          | JWT          | WebSocket tiempo real             |

\* El webhook valida firma de MercadoPago.

---

## ✅ Checklist de Entrega

- [x] Backend con capas router/service/uow/repository
- [x] Modelo de datos completo con soft-delete y snapshots
- [x] Seed data idempotente con datos de ejemplo
- [x] Autenticación JWT con cookies + RBAC
- [x] Catálogo de productos + carrito persistente
- [x] Variantes de producto (talle/color) con selector
- [x] Checkout con MercadoPago + pago en efectivo
- [x] Máquina de estados de pedidos (FSM) con 5 estados
- [x] Notificaciones WebSocket en tiempo real
- [x] Panel de administración con CRUD completo
- [x] Dashboard de estadísticas con recharts
- [x] Tests con pytest y TestClient
- [x] Rate limiting en endpoints de autenticación
- [x] Integración con Cloudinary para imágenes

---

## 🎥 Video Demostración

> *(https://youtu.be/UbdxQId21Ec?feature=shared)*

Mostrar:
1. Catálogo de productos y variantes
2. Creación de pedido con MP
3. Timeline de estado en tiempo real vía WebSocket
4. Panel admin: CRUD productos, gestión pedidos, estadísticas
5. Subida de imagen a Cloudinary

