# User Management API

Welcome to the **User Management API** documentation! This API provides endpoints for managing users, their subscriptions, and related resources such as API keys and plans.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [User Management](#user-management)
  - [Subscription Management](#subscription-management)
  - [Plan Management](#plan-management)
  - [API Key Management](#api-key-management)
- [Exception Handling](#exception-handling)
- [Authentication](#authentication)
- [Pagination](#pagination)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

The User Management API provides a suite of endpoints to manage user accounts, subscriptions, plans, and API keys. It uses NestJS and MongoDB for backend operations and follows RESTful principles.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/user-management-api.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd user-management-api
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   Create a `.env` file in the root directory and provide the necessary configuration:
   ```
   PORT=6969
   MONGO_URI=mongodb://localhost:27017/user-management
   JWT_SECRET=your_jwt_secret
   RATE_LIMIT_TTL=
   RATE_LIMIT_LIMIT=
   ADMIN_EMAIL=
   ADMIN_PASSWORD=
   ```

5. **Run the application:**
   ```bash
   npm run start
   ```

6. **Run tests (optional):**
   ```bash
   npm run test
   ```

## API Endpoints

### User Management

- **Create User**
  - **Endpoint:** `POST /users`
  - **Description:** Creates a new user and assigns a default plan.
  - **Request Body:** 
    ```json
    {
      "email": "user@example.com",
      "password": "string",
      "otp": "string",
      "name": "string"
    }
    ```

- **Find All Users**
  - **Endpoint:** `GET /users`
  - **Description:** Retrieves a paginated list of all users.
  - **Query Parameters:**
    - `page` (optional): Page number (default: 1)
    - `limit` (optional): Number of users per page (default: 10)

- **Find One User**
  - **Endpoint:** `GET /users/:id`
  - **Description:** Retrieves a user by their ID.

- **Update User**
  - **Endpoint:** `PUT /users/:id`
  - **Description:** Updates user details.
  - **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "string",
      "name": "string"
    }
    ```

- **Delete User**
  - **Endpoint:** `DELETE /users/:id`
  - **Description:** Deletes a user by their ID.

- **Validate Password**
  - **Endpoint:** `POST /users/:id/validate-password`
  - **Description:** Validates a user's password.
  - **Request Body:**
    ```json
    {
      "password": "string"
    }
    ```

### Subscription Management

- **Create Subscription**
  - **Endpoint:** `POST /subscriptions`
  - **Description:** Creates a new subscription for a user.

- **Find Subscription by User ID**
  - **Endpoint:** `GET /subscriptions/:userId`
  - **Description:** Retrieves an active subscription by user ID.

- **Find All Subscriptions**
  - **Endpoint:** `GET /subscriptions`
  - **Description:** Retrieves a paginated list of all subscriptions.
  - **Query Parameters:**
    - `page` (optional): Page number (default: 1)
    - `limit` (optional): Number of subscriptions per page (default: 10)

- **Update Subscription**
  - **Endpoint:** `PUT /subscriptions/:userId`
  - **Description:** Updates the subscription plan for a user.

### Plan Management

- **Create Plan**
  - **Endpoint:** `POST /plans`
  - **Description:** Creates a new plan.
  - **Request Body:**
    ```json
    {
      "name": "string",
      "description": "string",
      "tag": "string",
      "monthlyApiCallLimit": 0,
      "price": 0,
      "durationInMonths": 0,
      "unlimited": false
    }
    ```

- **Find All Plans**
  - **Endpoint:** `GET /plans`
  - **Description:** Retrieves a paginated list of all plans.
  - **Query Parameters:**
    - `page` (optional): Page number (default: 1)
    - `limit` (optional): Number of plans per page (default: 10)

- **Find Plan by ID**
  - **Endpoint:** `GET /plans/:id`
  - **Description:** Retrieves a plan by its ID.

- **Update Plan**
  - **Endpoint:** `PUT /plans/:id`
  - **Description:** Updates plan details.
  - **Request Body:**
    ```json
    {
      "name": "string",
      "description": "string",
      "tag": "string",
      "monthlyApiCallLimit": 0,
      "price": 0,
      "durationInMonths": 0,
      "unlimited": false
    }
    ```

- **Delete Plan**
  - **Endpoint:** `DELETE /plans/:id`
  - **Description:** Deletes a plan by its ID.

### API Key Management

- **Create API Key**
  - **Endpoint:** `POST /apikeys`
  - **Description:** Generates a new API key for a user.

- **Validate API Key**
  - **Endpoint:** `POST /apikeys/validate`
  - **Description:** Validates if the provided API key is valid.
  - **Request Body:**
    ```json
    {
      "apiKey": "string"
    }
    ```

## Exception Handling

The API uses standard HTTP status codes to indicate success or failure:

- `200 OK` - The request was successful.
- `201 Created` - A resource was successfully created.
- `400 Bad Request` - The request was invalid or malformed.
- `401 Unauthorized` - Authentication is required or failed.
- `403 Forbidden` - The request is understood but refused.
- `404 Not Found` - The requested resource could not be found.
- `500 Internal Server Error` - An unexpected error occurred on the server.

## Authentication

The API does not require authentication for most endpoints, but API keys are used for access control. Ensure that your requests include valid API keys where necessary.

## Pagination

For endpoints that return lists of resources, pagination is implemented using `page` and `limit` query parameters:

- `page`: The page number (default is 1).
- `limit`: The number of items per page (default is 10).

## Testing

To run tests, ensure you have all dependencies installed and then execute:

```bash
npm run test
```

## Contributing

Contributions are welcome! Please open an issue or a pull request on GitHub if you have suggestions or improvements.

1. **Fork the repository.**
2. **Create a new branch (`git checkout -b feature-branch`).**
3. **Make your changes.**
4. **Commit your changes (`git commit -am 'Add feature'`).**
5. **Push to the branch (`git push origin feature-branch`).**
6. **Open a pull request.**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Feel free to customize the sections and examples according to your specific API requirements and any additional details relevant to your project.
