
---

# 🛡️ Auth App GraphQL API

This GraphQL API provides user authentication with support for email/password registration, traditional login, and biometric login. Each mutation returns a `UserModel` containing `userId`, `name`, `email`, `token` and optional `biometricKey`.

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone <repo-url>
cd <project-directory>
```

### 2️⃣ Create a `.env` File
Make sure to provide the exact values defined in `.env.example`.

### 3️⃣ Install Dependencies
```sh
npm install
```

### 4️⃣ Start Docker Containers
Make sure Docker is running, then:
```sh
docker compose up -d
```

### 5️⃣ Sync Prisma Schema with DB & Generate Prisma Client
```sh
npx prisma db push 
```

### 6️⃣ Start the Development Server
```sh
npm run start:dev
```

Once the server starts, you should see:
```
Application is running on: http://localhost:6000
```

### 7️⃣ Run Unit Tests
```sh
npm run test
```

