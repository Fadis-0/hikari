# Backend Requirements for ecommerce-app

This document outlines the functional and non-functional requirements for the backend system that will power the Next.js e-commerce application.

## 1. Functional Requirements

### 1.1. User Authentication & Authorization
- **[F-AUTH-1]** Users must be able to register for a new account using an email and password.
- **[F-AUTH-2]** Registered users must be able to log in to their account.
- **[F-AUTH-3]** The system must support at least two user roles: `USER` and `ADMIN`.
- **[F-AUTH-4]** Passwords must be securely hashed before being stored in the database.
- **[F-AUTH-5]** The system will use JSON Web Tokens (JWT) for session management and to protect API routes.

### 1.2. Product Catalog
- **[F-PROD-1]** The public should be able to list all available products.
- **[F-PROD-2]** Product listings must support filtering (e.g., by category, store) and sorting (e.g., by price, name).
- **[F-PROD-3]** The public should be able to view the details of a single product.
- **[F-PROD-4]** The system must handle product inventory/stock levels.

### 1.3. Shopping Cart
- **[F-CART-1]** Authenticated users must have a persistent shopping cart.
- **[F-CART-2]** Users must be able to add a product to their cart.
- **[F-CART-3]** Users must be able to remove a product from their cart.
- **[F-CART-4]** Users must be able to update the quantity of a product in their cart.
- **[F-CART-5]** Users must be able to view the current contents of their cart with a calculated total price.

### 1.4. Checkout & Orders
- **[F-ORDER-1]** Authenticated users must be able to place an order from the items in their cart.
- **[F-ORDER-2]** The system must integrate with a payment provider (e.g., Stripe) to handle transactions.
- **[F-ORDER-3]** Upon successful payment, an order record is created with a status (e.g., `PENDING`, `PAID`, `SHIPPED`).
- **[F-ORDER-4]** Authenticated users must be able to view their order history.

### 1.5. Admin Panel
- **[F-ADMIN-1]** Admins must have a secure dashboard, separate from the user-facing site.
- **[F-ADMIN-2]** Admins must be able to perform CRUD (Create, Read, Update, Delete) operations on products.
- **[F-ADMIN-3]** Admins must be able to perform CRUD operations on stores/vendors.
- **[F-ADMIN-4]** Admins must be able to view all orders placed on the platform.
- **[F-ADMIN-5]** Admins must be able to update the status of an order (e.g., from `PAID` to `SHIPPED`).
- **[F-ADMIN-6]** Admins must be able to view a list of all registered users.

## 2. Non-Functional Requirements

### 2.1. Security
- **[NF-SEC-1]** All API endpoints must be protected based on user roles (e.g., only admins can access admin routes).
- **[NF-SEC-2]** All user input must be validated to prevent injection attacks (SQLi, XSS).
- **[NF-SEC-3]** API keys and database credentials must be stored securely and not exposed in the codebase.

### 2.2. Performance
- **[NF-PERF-1]** API responses should be delivered in under 500ms for typical requests.
- **[NF-PERF-2]** Database queries must be optimized with appropriate indexing.
- **[NF-PERF-3]** The system should implement caching for frequently accessed, static data (e.g., product categories).

### 2.3. Scalability
- **[NF-SCALE-1]** The backend architecture must be stateless to allow for horizontal scaling.
- **[NF-SCALE-2]** The database choice should support a large number of concurrent connections.

## 3. Data Models

- **User:** `id`, `name`, `email`, `passwordHash`, `role`, `createdAt`, `updatedAt`
- **Store:** `id`, `name`, `description`, `ownerId` (foreign key to User)
- **Product:** `id`, `name`, `description`, `price`, `imageUrl`, `stockQuantity`, `storeId` (foreign key to Store)
- **Cart:** `id`, `userId` (foreign key to User)
- **CartItem:** `id`, `cartId`, `productId`, `quantity`
- **Order:** `id`, `userId`, `totalAmount`, `status`, `shippingAddress`, `createdAt`
- **OrderItem:** `id`, `orderId`, `productId`, `quantity`, `priceAtPurchase`
