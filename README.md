Abi's Electronics

A full-stack e-commerce store.

Users can browse products, register/log in, manage a shopping cart, and place orders — all backed by a MongoDB database and a JWT-authenticated Express API.

🔗 Live demo: https://codealpha-ecommerce-ddut.onrender.com/

Tech Stack

Frontend: HTML, CSS, Vanilla JavaScript
Backend: Node.js, Express.js
Database: MongoDB (via Mongoose), hosted on MongoDB Atlas
Authentication: JWT (JSON Web Tokens), passwords hashed with bcryptjs
Deployment: Render

Features

-  Product listing and detail pages, backed by a MongoDB `Products` collection
-  User registration and login with hashed passwords and JWT-based authentication
-  Shopping cart — add, update quantity, and remove items (tied to the logged-in user)
-  Order checkout — snapshots cart contents into a permanent order record, then clears the cart
-  Order history — view past orders and individual order details
-  Auth-aware navigation (Login/Register vs. Logout shown based on session)
   
Getting Started (Local Setup)

1. Clone the repository
```bash
git clone https://github.com/enjoy4l/CodeAlpha_Ecommerce.git
cd CodeAlpha_Ecommerce
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the project root (see `.env.example` for reference):
```env
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-long-random-secret
PORT=3000
```

4. (Optional) Seed sample products
```bash
node seed.js
```

5. Run the server
```bash
node server.js
```

Visit `http://localhost:3000` in your browser.

---

API Endpoints

Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get a single product by ID |

Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a JWT |

Cart *(requires `Authorization: Bearer <token>`)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get the logged-in user's cart |
| POST | `/api/cart` | Add a product to the cart |
| PUT | `/api/cart/:productId` | Update an item's quantity |
| DELETE | `/api/cart/:productId` | Remove an item from the cart |

Orders *(requires `Authorization: Bearer <token>`)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders/checkout` | Convert the current cart into an order |
| GET | `/api/orders` | Get the logged-in user's order history |
| GET | `/api/orders/:id` | Get a single order's details |

---

Project Structure

```
CodeAlpha_Ecommerce/
├── controllers/     → request-handling logic
├── models/          → Mongoose schemas (Product, User, Cart, Order)
├── routes/          → API route definitions
├── middleware/      → JWT auth middleware
├── public/          → frontend HTML/CSS/JS
├── server.js        → app entry point
└── seed.js          → sample product seeder
```

---

About

Built as part of the **CodeAlpha Full Stack Development Internship**.
