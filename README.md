# 🤖 Cognexa

### AI-Powered Interview Simulator

An intelligent, adaptive platform for interview preparation and evaluation.

---

## 📌 Overview

**Cognexa** is an intelligent, adaptive platform for interview preparation and evaluation. It helps students and job seekers practice real-world interview scenarios by dynamically generating role-based questions and evaluating answers using AI, providing instant feedback and performance insights.

---

## 🚀 Key Features

- **Role & Level Selection**: Choose job role (e.g., Software Engineer, Data Analyst) and experience level (Fresher → Senior).
- **AI Question Generation**: Dynamic question creation using LLMs (GPT-4o-mini/Grok), role-specific and difficulty-adjusted.
- **Voice & Text Input**: Answer naturally using text or Speech-to-Text via the Web Speech API.
- **Multi-dimensional Evaluation**: Detailed scoring on Technical Accuracy, Completeness, Clarity, Relevance, and Examples.
- **Interactive Dashboard**: Track your performance over time with trend charts and AI-driven insights.

---

## 🛠️ Tech Stack (MERN)

| Layer       | Technology                             |
| ----------- | -------------------------------------- |
| **Frontend**| React.js, Tailwind CSS, Recharts       |
| **Backend** | Node.js, Express.js                    |
| **Database**| MongoDB (Standalone/Atlas)             |
| **AI Engine**| OpenAI / Grok (xAI) API                |
| **Auth**     | JWT (Stateless authentication)         |
| **Icons**    | Lucide React                           |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18 or later
- **MongoDB**: A local instance or MongoDB Atlas account
- **API Key**: An OpenAI or xAI (Grok) API key

### 2. Setup
Clone the repo and install dependencies for both client and server:
```bash
# Clone the repository
git clone https://github.com/your-repo/cognexa.git

# Install dependencies (from root)
cd client && npm install
cd ../server && npm install
```

```

### 4. Run the Application
Start the backend and frontend in development mode:
```bash
# In the server directory
npm run dev

# In the client directory (in a separate terminal)
npm run dev
```


---

## 🧠 System Architecture

* **Client-Server Model**: REST API communication over HTTPS.
* **Stateless Auth**: JWT-based session management.
* **Modular Services**:
  * **AI Service**: Handles question generation and evaluation.
  * **Session Service**: Manages interview sessions and state.
  * **User Service**: Handles authentication and profiles.

---

## 🔐 Security Features

* **Password Hashing**: Secure storage using `bcrypt`.
* **JWT Authentication**: Protected API routes.
* **CORS Policy**: Restricted cross-origin resource sharing.
* **Input Validation**: Sanitization and validation for all user inputs.

---

## 🔄 Interview Workflow

1. **User Login**: Secure entry into the platform.
2. **Configuration**: Select role, experience level, and tech stack.
3. **Question Generation**: AI prepares unique questions for the session.
4. **Answer Submission**: User responds via text or voice.
5. **AI Evaluation**: Immediate feedback and multi-dimensional scoring.
6. **Dashboard Track**: Performance stored and tracked for long-term growth.

---

## 🏁 Version
**v1.0.0 
