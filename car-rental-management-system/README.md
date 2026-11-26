# Car Rental Management System (MERN)

A simple car rental website. Customers can browse cars, search and filter, and book a car.
Admins can add, edit and delete cars and manage all bookings.

**Tech:** React (Vite) + Tailwind CSS, Node.js + Express, MongoDB (Mongoose), JWT login.

## Folder overview

```
car-rental-management-system/
├── frontend/
├── backend/
├── .gitignore
└── README.md
```

## Requirements

- Node.js 18 or newer
- A MongoDB Atlas cluster
- MongoDB Database Tools if you need to copy data from a local MongoDB database

## Setup

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Create `backend/.env` using `backend/.env.example`, then add your Atlas connection string and a private JWT secret:

```
PORT=5000
MONGODB_URI=mongodb+srv://<db-user>:<db-password>@<cluster-host>/car-rental?retryWrites=true&w=majority&appName=CarRental
JWT_SECRET=replace_with_a_long_random_secret
```

In Atlas, create a database user and allow your development/deployment IP address in Network Access. Replace the URI placeholders with the values from Atlas. If the password contains special characters, URL-encode them. Never commit `backend/.env` or share its contents.

If you already have `backend/.env`, replace its local database setting with `MONGODB_URI` and your Atlas connection string. The backend temporarily accepts the old `MONGO_URI` variable name so existing local setups continue to start; it prints a warning until you rename the variable.

### Copy existing local data to Atlas

Changing the connection string does not copy records. Before switching, back up your current `car-rental` database and restore it to Atlas. Run these commands in PowerShell with MongoDB Database Tools installed; set `ATLAS_MONGO_URI` to the same URI you use in `backend/.env`:

```powershell
$env:LOCAL_MONGO_URI = "mongodb://127.0.0.1:27017/car-rental"
$env:ATLAS_MONGO_URI = "mongodb+srv://<db-user>:<db-password>@<cluster-host>/car-rental?retryWrites=true&w=majority&appName=CarRental"
mongodump --uri="$env:LOCAL_MONGO_URI" --archive=car-rental.archive --gzip
mongorestore --uri="$env:ATLAS_MONGO_URI" --archive=car-rental.archive --gzip
```

Confirm the `cars`, `users`, and `bookings` records are present in Atlas before starting the application with the Atlas URI. Keep the backup until you have verified the imported records, then remove `car-rental.archive`.

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

If your backend runs on a different address, create `frontend/.env` with:
`VITE_API_URL=http://localhost:5000/api`

The backend creates the `cars`, `users`, and `bookings` collections in the database named in `MONGODB_URI` when it connects. Collections start empty if you have not imported or added any records.

## First admin account

If `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in `backend/.env`, the backend creates or updates the admin account whenever it starts. The admin name is set with `ADMIN_NAME`. Admins can add cars from the dashboard; those car records are saved in the `cars` collection. User records are stored in the `users` collection with their names, emails, roles and timestamps. Passwords are hashed and are not returned by the API.

Passwords are stored using Node.js built-in scrypt hashing. Accounts created with the former bcrypt implementation cannot be authenticated by this version; remove those user records and register again.

## Features

- Home page with hero banner, popular cars and about section (smooth scroll)
- Car catalog with search, category, fuel and price filters
- Car details page
- Booking form with validation, price preview and confirmation popup
- Sign up / login (JWT) and My Bookings page
- Admin dashboard: add / edit / delete cars, view and update all bookings
- Dark / light mode (saved in the browser)
- Frontend loads cars from MongoDB through the API and shows an error if it cannot connect

## API endpoints

| Method | URL | Access |
| --- | --- | --- |
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/cars | Public (optional: search, category, fuelType, maxPrice) |
| GET | /api/cars/:id | Public |
| POST | /api/cars | Admin |
| PUT | /api/cars/:id | Admin |
| DELETE | /api/cars/:id | Admin |
| POST | /api/bookings | Logged in |
| GET | /api/bookings/my | Logged in |
| GET | /api/bookings | Admin |
| PUT | /api/bookings/:id/status | Admin |
