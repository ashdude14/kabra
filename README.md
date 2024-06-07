# User Management and Attendance System

This project is a Node.js back-end for React-Native application built with Express and MongoDB for managing user registration, updating user data, fetching user information, and deleting users. It also includes endpoints for handling attendance data for users.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Error Handling](#error-handling)

## Prerequisites

Before running this application, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)
- MongoDB

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/ashdude14/kabra.git
    ```

2. Navigate to the project directory:

    ```sh
    cd kabra
    ```

3. Install the dependencies:

    ```sh
    npm install
    ```

## Environment Variables

Create a `.env` file in the root directory of the project and add your MongoDB URI:

```plaintext
URIL=your_mongodb_uri
PORT=8000
```

## Usage
To start the server, run:

```sh
npm start
```
The server will start on the port specified in the .env file or the default port 8000.

## Endpoints
Health Check
GET /

Returns a status indicating the server is running.

```json

{
  "status": "started"
}
```
User Registration
POST /register

Registers a new user.

Request Body:

```json

{
  "name": "John Doe",
  "mobile": "1234567890",
  "password": "password123"
}
```
Responses:
```
200: User created
400: User already exists
500: Internal Server Error
```
Update User Data
PUT /update/

Updates the attendance data for a user.

Request Parameters:

mobile: User's mobile number
Request Body:

```json

{
  "date": "01/01/2024",
  "location": "New York"
}
```
Responses:

200: User data updated
404: User not found
500: Internal Server Error
Get User Data
GET /

Retrieves data for a specific user.

Request Parameters:

mobile: User's mobile number
Responses:
```json
200: User data
404: User not found
```
Get All Users Data for a Given Date
GET /date/

Retrieves all users' data for a given date.

Request Parameters:

date: Date in the format MM/DD/YYYY
Responses:
```json
200: List of users with their data for the specified date
500: Internal Server Error
```
Delete User
DELETE /

Deletes a user.

Request Parameters:

mobile: User's mobile number
Responses:
```json
200: User deleted successfully
404: User not found
500: Internal Server Error
```
## Error Handling
All endpoints return a standard error response in case of failure:

```json

{
  "error": "Error message"
}
```
Common Error Codes
400: Bad Request
404: Not Found
500: Internal Server Error
## License
This project is licensed under the MIT License.
