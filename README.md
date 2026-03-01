📘 Basic Node API – AWS Lambda
# 🚀 Basic Node API using AWS Lambda & API Gateway

A simple serverless REST API built using **Node.js**, deployed on **AWS Lambda**, and exposed via **API Gateway**.

This project demonstrates how to build and deploy a basic cloud-native backend application.

---

## 📌 Project Overview

This API includes a simple GET endpoint:

- `GET /hello` → Returns a welcome message

The goal of this project is to understand:

- How AWS Lambda works
- How API Gateway connects to Lambda
- How to structure a backend API
- Basic cloud deployment concepts

---

## 🏗️ Architecture

Client (Browser / Postman)
        ↓
API Gateway
        ↓
AWS Lambda (Node.js)
        ↓
(Response JSON)

Architecture diagram is available in the `/architecture` folder.

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- AWS Lambda
- AWS API Gateway
- Git & GitHub

---

## 📂 Project Structure


basic-node-api/
│
├── src/
│ └── handler.js
│
├── tests/
│ └── test-health.js
│
├── architecture/
│ └── architecture-diagram.png
│
├── package.json
├── .gitignore
└── README.md


---

## ⚙️ How It Works

1. API Gateway receives HTTP request
2. It triggers the Lambda function
3. Lambda executes Node.js code
4. JSON response is returned to client

---

## 📍 API Endpoint

### GET /hello

**Request:**

GET /hello


**Response:**
```json
{
  "message": "Hello from basic-node-api!"
}
🚀 Deployment

This project was deployed manually using:

AWS Lambda Console

API Gateway Console

Steps followed:

Created Lambda function

Uploaded Node.js code

Created API Gateway route

Integrated with Lambda

Deployed API stage

🧪 Testing

The API was tested using:

Postman

Browser (for GET request)

📚 Learning Objectives

Understand serverless architecture

Learn Lambda event-driven execution

Understand API Gateway integration

Practice Git version control

🔮 Future Improvements

Connect to PostgreSQL (AWS RDS)

Add multiple routes (CRUD operations)

Use Serverless Framework for automated deployment

Implement CI/CD using GitHub Actions

👩‍💻 Author

Athulya K V
BTech – Artificial Intelligence & Data Science
Aspiring Data Analyst & Backend Developer
