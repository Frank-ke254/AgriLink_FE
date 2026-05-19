# FarmCycle (Django REST Framework Migration)

FarmCycle now uses a Django REST Framework backend with PostgreSQL and JWT authentication.

## Stack

- Backend: Django 5 + DRF
- Auth: SimpleJWT
- Database: PostgreSQL (primary)
- API docs/schema: drf-spectacular
- Frontend: Static HTML/CSS/JS in `src/`, now calling DRF endpoints

## Backend setup

1. Install Python dependencies:

```bash
pip install -r backend/requirements.txt
```

2. Configure environment in `.env` at the repo root.

3. Run migrations and seed data:

```bash
cd backend
python manage.py migrate
python manage.py seed_demo
```

4. Start the backend:

```bash
python manage.py runserver
```

Server runs at `http://127.0.0.1:8000`.

## API routes

- Auth:
  - `POST /api/v1/auth/register/`
  - `POST /api/v1/auth/login/`
  - `POST /api/v1/auth/refresh/`
  - `GET /api/v1/auth/me/`
- Domain:
  - `/api/v1/suppliers/`
  - `/api/v1/farmers/`
  - `/api/v1/listings/`
  - `/api/v1/requests/`
- Health: `GET /health/`
- OpenAPI schema: `GET /api/schema/`
- Swagger UI: `GET /api/docs/`

## Tests

Run backend tests:

```bash
cd backend
DB_ENGINE=sqlite python manage.py test
```