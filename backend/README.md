# Backend

Node + Express + MongoDB API for the e-commerce app.

## Setup

```bash
npm install
```

Create `.env` in the root:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your-db
JWT_SECRET=your-secret-key
```

## Run

```bash
npm run dev
```

Seed products (8 items):

```bash
npm run seed
```

## API

Base: `http://localhost:5000/api`

**Auth**
- `POST /auth/register` – body: name, email, password
- `POST /auth/login` – body: email, password
- `GET /auth/profile` – Bearer token required

**Products**
- `GET /products` – list all
- `GET /products/:id` – get one
- `POST /products` – create (auth)
- `PUT /products/:id` – update (auth)
- `DELETE /products/:id` – delete (auth)

**Cart** (all require auth)
- `GET /cart` – get cart
- `POST /cart/add` – body: productId, quantity
- `PUT /cart/update/:productId` – body: quantity
- `DELETE /cart/remove/:productId` – remove item
