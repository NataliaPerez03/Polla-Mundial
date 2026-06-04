# 🏆 Polla Mundial 2026

Sistema de pronósticos para el **FIFA World Cup 2026** (México · EEUU · Canadá).

## Stack Tecnológico

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: API Routes (Next.js)
- **Base de datos**: PostgreSQL + Prisma ORM v7
- **Autenticación**: NextAuth.js v5 (credentials)
- **UI**: shadcn/ui (Radix UI) + Lucide Icons
- **Gráficas**: Recharts

## Módulos

| Ruta | Descripción |
|------|-------------|
| `/login` | Autenticación de usuarios |
| `/dashboard` | Resumen personal: puntos, posición, partidos pendientes |
| `/fixture` | Los 104 partidos organizados por fase y grupo |
| `/mis-pronosticos` | Registrar/editar pronósticos (bloqueado 1h antes) |
| `/tabla-posiciones` | Ranking en tiempo real con podio y estadísticas |
| `/estadisticas` | Gráficas de evolución, distribución de pronósticos |
| `/pozo` | Gestión económica: pozo, premios, estado de pagos |
| `/admin` | Panel admin: resultados, usuarios, configuración |

## Sistema de Puntos (configurable)

| Acción | Puntos |
|--------|--------|
| Resultado exacto | 3 pts |
| Ganador/empate correcto | 1 pt |
| Bonus exacto eliminatoria | +1 pt extra |
| Campeón del mundo acertado | 15 pts |
| Semifinalista acertado (c/u) | 5 pts |

## Instalación

### 1. Prerequisitos
- Node.js 18+
- PostgreSQL 14+

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
# Editar .env.local con tus datos de PostgreSQL
```

### 4. Base de datos
```bash
# Crear la base de datos en PostgreSQL
createdb polla_mundial

# Aplicar esquema
npm run db:push

# Cargar fixture del Mundial 2026 (104 partidos + usuarios demo)
npm run db:seed
```

### 5. Iniciar
```bash
npm run dev
# → http://localhost:3000
```

## Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | `admin@mundial2026.com` | `admin123` |
| Participante | `jugador1@mundial2026.com` | `player123` |

## Fixture incluido (104 partidos)

- **72 partidos** de fase de grupos (12 grupos A-L, 6 partidos c/u)
- **16** Round of 32 · **8** Octavos · **4** Cuartos · **2** Semis · **1** 3° · **1** Final
- Fechas: **11 Jun – 19 Jul 2026**

## Comandos

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run db:studio    # Prisma Studio
npm run db:seed      # Recargar fixture
npm run db:reset     # Reset + seed
```
