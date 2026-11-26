# Car Rental Management System

A full-stack car rental application. Customers can browse and filter cars, create an account, and submit bookings. Admins can manage cars and booking statuses.

## Technology

- Frontend: React 18, React Router, Vite, Tailwind CSS
- Backend: Node.js, Express 4, Mongoose 8
- Database: MongoDB Atlas
- Authentication: JSON Web Tokens (JWT)

## Project structure

```text
car-rental-management-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── carController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Car.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── carRoutes.js
│   ├── utils/
│   │   └── password.js
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── images/cars/placeholder.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── booking/
│   │   │   │   └── BookingForm.jsx
│   │   │   ├── cars/
│   │   │   │   ├── CarCard.jsx
│   │   │   │   ├── CarList.jsx
│   │   │   │   └── SearchFilter.jsx
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Modal.jsx
│   │   │   ├── home/
│   │   │   │   ├── AboutSection.jsx
│   │   │   │   ├── FeaturedCars.jsx
│   │   │   │   └── HeroSection.jsx
│   │   │   └── layout/
│   │   │       ├── Footer.jsx
│   │   │       └── Navbar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── CarDetailsPage.jsx
│   │   │   ├── CarsPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginSignupPage.jsx
│   │   │   └── MyBookingsPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── localStorage.js
│   │   ├── utils/
│   │   │   └── formValidation.js
│   │   ├── assets/
│   │   │   └── .gitkeep
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
└── README.md
```

The `package-lock.json` files in both applications should be committed to keep dependency installation reproducible. Dependency folders and generated build output should not be committed.

## Requirements

- Node.js 18 or newer
- npm
- A MongoDB Atlas cluster

## Configure MongoDB Atlas

1. Create a MongoDB Atlas cluster and a database user.
2. In Atlas Network Access, allow the IP address of the computer or server running the backend.
3. Copy the cluster connection string and replace the placeholders with the database user's username, password, and cluster host.
4. If the password contains reserved URL characters, URL-encode them in the connection string.
5. Keep the connection string private. Do not put it in frontend variables or commit it to GitHub.

The backend creates the `cars`, `users`, and `bookings` collections when it connects. The database name used in the connection string is `car-rental` in the example below.

## Run locally

Open two terminals from the project root.

### Backend

```powershell
Copy-Item backend/.env.example backend/.env
```

Edit `backend/.env` and set your actual values:

```dotenv
PORT=5000
MONGODB_URI=mongodb+srv://<db-user>:<db-password>@<cluster-host>/car-rental?retryWrites=true&w=majority&appName=CarRental
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Replace the example URI and JWT secret. `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are optional; set both admin email and password to create or update an admin account when the backend starts. Admin passwords must be at least six characters. Never commit the resulting `.env` file.

Install and start the backend:

```powershell
Set-Location backend
npm install
npm run dev
```

The API starts on `http://localhost:5000`. The backend still accepts the old `MONGO_URI` variable name for compatibility, but new configuration should use `MONGODB_URI`.

### Frontend

In the second terminal, from the project root:

```powershell
Copy-Item frontend/.env.example frontend/.env
Set-Location frontend
npm install
npm run dev
```

The frontend runs at the address printed by Vite, normally `http://localhost:5173`. `VITE_API_URL` defaults to `http://localhost:5000/api`; change it in `frontend/.env` only if the backend API is at another address.

To create a production frontend build:

```powershell
Set-Location frontend
npm run build
```

## Existing local MongoDB data

Changing the backend connection string does not copy data. If your records are in a local `car-rental` database and you want to keep them in Atlas, use MongoDB Database Tools to back them up and restore them before switching the backend to the Atlas URI.

Run from the project root in PowerShell, with MongoDB Database Tools installed. Replace the Atlas URI with your real connection string. Do not commit the archive or share the connection string.

```powershell
$env:LOCAL_MONGO_URI = "mongodb://127.0.0.1:27017/car-rental"
$env:ATLAS_MONGO_URI = "mongodb+srv://<db-user>:<db-password>@<cluster-host>/car-rental?retryWrites=true&w=majority&appName=CarRental"
mongodump --uri="$env:LOCAL_MONGO_URI" --archive=car-rental.archive --gzip
mongorestore --uri="$env:ATLAS_MONGO_URI" --archive=car-rental.archive --gzip
```

Verify the collections and records in Atlas before using the Atlas URI in `backend/.env`. Keep the backup until verification is complete, then delete it.

## Application features

- Browse, search, and filter cars by category, fuel type, and maximum daily price
- View car details and availability
- Register and log in
- Submit bookings with date validation and price calculation
- View personal bookings
- Admin dashboard to add, edit, and delete cars and update booking statuses
- Light and dark themes

## API

All API paths are relative to `http://localhost:5000`.

| Method | Path | Access |
| --- | --- | --- |
| `GET` | `/` | Public health message |
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |
| `GET` | `/api/cars` | Public; optional `search`, `category`, `fuelType`, and `maxPrice` query parameters |
| `GET` | `/api/cars/:id` | Public |
| `POST` | `/api/cars` | Admin |
| `PUT` | `/api/cars/:id` | Admin |
| `DELETE` | `/api/cars/:id` | Admin |
| `POST` | `/api/bookings` | Authenticated user |
| `GET` | `/api/bookings/my` | Authenticated user |
| `GET` | `/api/bookings` | Admin |
| `PUT` | `/api/bookings/:id/status` | Admin |

Protected endpoints require the JWT returned by login or registration in the `Authorization: Bearer <token>` header.

## Prepare and push to GitHub

Review `.gitignore` and confirm `backend/.env`, `frontend/.env`, `node_modules`, build output, and database backups are not included. Keep both package lock files.

From the project root:

```powershell
git init
git add .
git status --short
```

Review the staged file list. If it contains a secret, environment file, database dump, or other private data, unstage and remove it before committing. Then commit and push to an empty GitHub repository:

```powershell
git commit -m "Initial project upload"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repository>.git
git push -u origin main
```

If Git has already been initialized, do not run `git init` or add a second `origin`; check the existing repository and remote first. If a secret was ever committed, removing the file in a later commit is not enough—rotate the credential and remove it from Git history.
