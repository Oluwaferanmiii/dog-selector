![Django](https://img.shields.io/badge/Django-5-green)
![React](https://img.shields.io/badge/React-19-blue)
![Docker](https://img.shields.io/badge/Docker-ready-blue)
![Postgres](https://img.shields.io/badge/PostgreSQL-16-blue)

# Test Task: Dog Selector

Dog Selector is a small internal tool for managing dog profiles (CRUD), including search, sorting, pagination, inline rating updates, bulk removal, and a Contact Us form that stores submissions in the database and is visible in Django Admin.

## Tech Stack

- Backend: Django + Django REST Framework (DRF)
- Frontend: React (Vite) + Bootstrap 5
- Database: PostgreSQL
- Docker: docker compose

---

## Features

### Dog List

- Paginated dog list (default 10 per page)
- Search by **Breed** and **Description**
- Sort by **Status**, **Breed**, **Description**, **Rating**
- Inline rating update (0–5)
- Edit via offcanvas panel (Note is required)
- Remove single dog with confirmation modal + danger toast
- Bulk remove selected dogs with confirmation modal + danger toast

### Contact Us

- Contact form saves submissions to PostgreSQL
- Submissions are available only in Django Admin

### Admin

- All models registered in Django Admin:
  - Dog, Breed, Description
  - ContactSubmission

---

## Project Structure

```
dog-selector
│
├── backend/        Django + DRF API
├── frontend/       React + Bootstrap UI
├── docker-compose.yml
└── README.md
```

---

## Running the project (Docker)

### 1) Start containers

From project root:

```
docker compose up --build
```

The backend container automatically runs database migrations on startup.

### 2) Create Django admin user

```
docker compose exec backend python manage.py createsuperuser
```

### 3) Seed the database (optional but recommended)

```
docker compose exec backend python manage.py seed
```

---

## Access

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/
- Django Admin: http://localhost:8000/admin/

---

## Running tests

Backend unit tests cover:

- Models
- Serializers
- API views

```
docker compose exec backend pytest
```

---

## API Endpoints (quick reference)

- Dogs
  - GET /api/dogs/ (search, ordering, pagination)
  - POST /api/dogs/
  - PATCH /api/dogs/{id}/
  - DELETE /api/dogs/{id}/
  - POST /api/dogs/bulk-delete/
- Contact
  - POST /api/contact/

---

## Implementation Notes

### Sorting

Sorting is implemented using DRF OrderingFilter.
Supporting fields:

```
status
rating
breed__name
description__text
```

### Search

Search is implemented using DRF SearchFilter across:

```
breed__name
description__text
```

---

## Future Improvements

- Authentication for admin actions
- Server-side filtering UI
- Production deployment configuration
- Improved test coverage

---

## Time Estimate

Development time: ~1–2 days
