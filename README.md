# BarberSoft

Sistema de gestión de citas para barbería con autenticación, gestión de servicios, barberos y citas.

## Stack Tecnológico

### Backend
- **Node.js** con **Express**
- **Prisma** (ORM)
- **SQLite** (base de datos)
- **JWT** (autenticación)
- **Zod** (validación)

### Frontend
- **React 19**
- **Vite** (build tool)
- **React Router** (enrutamiento)
- **Axios** (HTTP client)

## Estructura del Proyecto

```
BarberSoft/
├── backend/          # API REST
│   ├── src/
│   │   ├── routes/   # Endpoints API
│   │   ├── middlewares/ # Auth y errores
│   │   └── prisma/  # Schema y migraciones
│   └── tests/        # Pruebas unitarias
└── frontend/         # Aplicación React
    └── src/
        ├── pages/    # Vistas
        ├── components/ # Componentes
        └── lib/      # Configuración API
```

## Inicio Rápido

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

El servidor corriendo en: `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La app en: `http://localhost:5173`

## Roles

- **admin**: Gestión de usuarios, barberos y servicios
- **barbero**: Gestión de horarios y citas propias
- **cliente**: Reservar citas

## API Endpoints

| Módulo | Endpoint | Descripción |
|--------|----------|-------------|
| Auth | `/api/v1/auth` | Registro, login, perfil |
| Services | `/api/v1/services` | CRUD servicios |
| Barbers | `/api/v1/barbers` | CRUD barberos |
| Appointments | `/api/v1/appointments` | Gestión citas |

## Tests

```bash
cd backend
npm test
```

## Licencia

MIT