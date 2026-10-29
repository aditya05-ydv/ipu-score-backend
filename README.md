🎓 IPU Score — MERN Stack Academic Result Dashboard

A full-stack web application that helps GGSIPU (Guru Gobind Singh Indraprastha University) students view their academic results across multiple semesters in a single dashboard. IPU Score retrieves results from the official examination portal, processes subject data, calculates SGPA and CGPA, and presents academic performance through interactive graphs and backlog tracking.

📌 Problem Statement

The official IPU examination portal (examweb.ggsipu.ac.in) has several limitations:

Students must navigate individual semester results.

SGPA and CGPA calculations may require manual effort.

Academic performance trends are not presented in a unified dashboard.

Backlogs and reappear subjects can be difficult to track across semesters.

IPU Score addresses these problems by providing a unified interface for retrieving, processing, and analyzing academic results.

✨ Features

🔐 IPU Portal Login: CAPTCHA-based authentication through the official examination portal.

📊 Multi-Semester Results: Fetches results across up to eight semesters using parallel requests.

🧮 SGPA & CGPA Calculator: Calculates academic performance using subject credits and grade points.

📈 Interactive Graphs: Displays semester-wise SGPA trends and subject-wise performance using custom SVG charts.

📉 Backlog Tracker: Flags subjects below the configured passing threshold.

🏷️ Grade & Division Mapping: Maps marks to grades and CGPA to division classifications.

🔍 Smart Subject Matching: Normalizes subject codes such as ES-101, ES101, and ES 101.

📋 Manual Calculator: Allows students to enter subject marks and credits manually.

📱 Responsive UI: Supports desktop, tablet, and mobile devices.

☁️ Cloud Deployment: Frontend hosted on Vercel and backend deployed on Render.

🛠️ Tech Stack

Frontend

Technology

Purpose

React 19

Component-based user interface

Vite

Frontend development and build tooling

Tailwind CSS

Responsive styling

Axios / Fetch API

HTTP requests to the backend

Inline SVG

Custom academic performance visualizations

Backend

Technology

Purpose

Node.js

JavaScript runtime

Express.js

REST API development

Mongoose

MongoDB object modeling

Axios

HTTP requests to the IPU examination portal

Cheerio

Server-side HTML parsing

Node.js crypto

Cryptographic hashing

CORS

Cross-origin request handling

dotenv

Environment variable management

Database

Technology

Purpose

MongoDB Atlas

Cloud-hosted NoSQL database

Subject collection

Stores subject codes, names, and credits

MissingSubject collection

Tracks subject codes that could not be found

Deployment

Platform

Purpose

Vercel

Frontend hosting

Render

Backend hosting

MongoDB Atlas

Cloud database

Environment variables

Configuration and secret management

🏗️ System Architecture

┌─────────────────────────┐
│     React Frontend      │
│     Vercel              │
└────────────┬────────────┘
             │
             │ HTTPS / REST API
             ▼
┌─────────────────────────┐
│     Express Backend     │
│     Node.js on Render   │
└────────┬────────┬───────┘
         │        │
         ▼        ▼
┌─────────────┐  ┌────────────────────┐
│ MongoDB     │  │ IPU Examination    │
│ Atlas       │  │ Portal             │
└─────────────┘  └────────────────────┘

Data Flow

Application loads: The frontend requests a CAPTCHA from the backend.

CAPTCHA retrieval: The backend contacts the IPU portal and returns the CAPTCHA image and required session information.

Login submission: The user enters the required credentials and CAPTCHA.

Authentication: The backend submits the login request using the authentication scheme expected by the IPU portal.

Result retrieval: The backend requests semester results in parallel.

Data processing: The backend returns the retrieved student profile and results.

Credit lookup: The application retrieves subject credits through the backend API.

Calculation: The frontend calculates SGPA and CGPA using the available subject data.

Dashboard rendering: The results are displayed through cards, tables, graphs, and backlog indicators.

📁 Project Structure

The project uses separate repositories for the frontend and backend.

Backend — ipu-score-backend

ipu-score-backend/
├── controllers/
│   └── resultController.js
├── models/
│   ├── Subject.js
│   └── MissingSubject.js
├── routes/
│   └── result.js
├── cleanup.js
├── normalize.js
├── seed.js
├── server.js
├── package.json
├── package-lock.json
└── .gitignore

Frontend — ipu-score-app

ipu-score-app/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── ResultPanel.jsx
│   │   └── SubjectRow.jsx
│   ├── pages/
│   │   ├── IPUResultPage.jsx
│   │   ├── SemesterPage.jsx
│   │   ├── CGPAPage.jsx
│   │   ├── ReferencePage.jsx
│   │   ├── AboutPage.jsx
│   │   └── AdminPage.jsx
│   ├── data/
│   │   └── schemes.js
│   ├── utils/
│   │   └── gradeUtils.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vite.config.js
├── tailwind.config.js
├── vercel.json
├── package.json
└── .gitignore

This structure documents the main files. Verify filenames against the actual repositories before relying on it as an exhaustive directory listing.

🔌 API Endpoints

The backend exposes REST API endpoints for authentication, result retrieval, and subject credit lookup.

Method

Endpoint

Description

GET

/api/captcha

Retrieves the CAPTCHA image and session information

POST

/api/login

Submits authentication details to the IPU portal

POST

/api/result

Retrieves available semester results

GET

/api/credit/:code

Looks up subject credits

GET

/

Backend health check

Example API Responses

The following examples use placeholder values. They are for documentation only.

GET /api/captcha

{
  "success": true,
  "captchaImage": "data:image/png;base64,PLACEHOLDER",
  "ipuCookie": "PLACEHOLDER_SESSION_COOKIE"
}

POST /api/login

{
  "success": true,
  "ipuCookie": "PLACEHOLDER_SESSION_COOKIE"
}

POST /api/result

{
  "success": true,
  "student": {
    "nrollno": "PLACEHOLDER_ROLL_NUMBER",
    "stname": "STUDENT NAME",
    "prgname": "B.TECH",
    "iname": "INSTITUTE NAME"
  },
  "results": [
    [
      "1",
      "ES101",
      "Engineering Mathematics-I",
      "30",
      "45",
      "75"
    ]
  ]
}

GET /api/credit/ES101

{
  "found": true,
  "code": "ES101",
  "credits": 4,
  "name": "Engineering Mathematics-I",
  "source": "mongodb"
}

Actual response fields depend on the implementation deployed in the backend.

🧮 SGPA & CGPA Calculation

IPU Score uses subject credits and grade points to calculate academic performance.

Grading Scale

The following table represents the grading scale configured in the application. Verify it against the applicable university regulations before treating the output as an official result.

Marks Range

Grade

Grade Point

90–100

O (Outstanding)

10

75–89

A+

9

65–74

A

8

55–64

B+

7

50–54

B

6

45–49

C

5

40–44

P (Pass)

4

0–39

F (Fail)

0

Formulas

Semester Grade Point Average (SGPA)

[
\mathrm{SGPA} =
\frac{\sum(\mathrm{Credits}\times\mathrm{Grade\ Points})}
{\sum\mathrm{Credits}}
]

Cumulative Grade Point Average (CGPA)

[
\mathrm{CGPA} =
\frac{\sum(\mathrm{Semester\ Credits}\times\mathrm{Semester\ SGPA})}
{\sum\mathrm{Semester\ Credits}}
]

Estimated Percentage

[
\mathrm{Percentage}=\mathrm{CGPA}\times10
]

The percentage conversion is an estimate unless confirmed by the applicable university rules. The exact calculation must also account for the institution's rules on failed subjects, repeated examinations, and applicable credits.

Division Classification

CGPA Range

Division

6.5 and above

First Division

5.0 to below 6.5

Second Division

4.0 to below 5.0

Third Division

Below 4.0

Below Minimum

🚀 Getting Started

Prerequisites

Node.js compatible with the project's dependencies

npm

MongoDB Atlas account or a local MongoDB instance

Git

1. Clone the Repositories

Clone the backend:

git clone https://github.com/aditya05-ydv/ipu-score-backend.git
cd ipu-score-backend

Clone the frontend separately:

git clone <YOUR_FRONTEND_REPOSITORY_URL>
cd ipu-score-app

Replace the frontend placeholder with your actual public repository URL.

2. Configure the Backend

Navigate to the backend directory and install dependencies:

npm install

Create a local .env file in the backend directory:

MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>
PORT=5000
FRONTEND_URL=http://localhost:5173

Replace the placeholders with your own local configuration. Do not commit real credentials to GitHub.

Seed the database if the project requires it:

node seed.js

Start the backend using the script defined in package.json:

npm start

If the start script is not configured, use the appropriate command for the actual backend entry point.

3. Configure the Frontend

Navigate to the frontend directory and install dependencies:

npm install

Create a .env file in the frontend directory:

VITE_API_URL=

Leave this empty only if the Vite development proxy is configured to forward API requests to the local backend.

Start the frontend:

npm run dev

4. Open the Application

Open the local development URL printed by Vite, typically:

http://localhost:5173

Use the application with your own IPU portal credentials. Do not share credentials or session cookies with others.

🔐 Security Considerations

Credential handling: Do not store student passwords in the database or application logs.

SHA-256 hashing: Hashing is not encryption. The implementation must match the authentication scheme required by the IPU portal.

Session protection: Treat IPU session cookies as sensitive authentication tokens. Avoid exposing them in logs, URLs, public examples, or shared screenshots.

HTTPS: Use HTTPS for communication between the frontend and backend in production.

CORS: Restrict permitted origins to the intended frontend domains.

Environment variables: Store database connection strings and private configuration in the hosting provider's environment settings.

Git protection: Add .env files to .gitignore and never publish real credentials.

Student privacy: Avoid unnecessarily storing or sharing personal academic records.

Error handling: Avoid returning stack traces, internal configuration, or sensitive authentication details in production responses.

Environment Variable Safety

The following values should never be replaced with real secrets in a public README:

MONGODB_URI=<REDACTED>
API_KEY=<REDACTED>
JWT_SECRET=<REDACTED>

These are illustrative variable names. Only configure variables that the application actually uses.

If a real password, API key, or database connection string has already been committed, rotate the exposed credential. Removing it from the latest README does not remove it from Git history or invalidate it.

🔑 Key Technical Decisions

1. Session Handling

The backend manages the session information required to communicate with the IPU portal. The exact session-handling implementation should be reviewed to ensure tokens are not exposed unnecessarily.

2. Parallel Semester Fetching

Parallel requests allow independent semester queries to run concurrently, reducing waiting time compared with sequential requests. Individual request failures can be handled without discarding successful results from other semesters.

3. Subject Code Normalization

Normalizing subject codes removes formatting differences such as spaces and hyphens, improving matching consistency.

4. Missing Subject Tracking

The MissingSubject collection records subject codes that could not be found, helping identify gaps in the subject credit database.

5. Custom SVG Charts

Inline SVG makes it possible to create responsive academic performance charts without a dedicated charting dependency.

6. Vite Development Proxy

The Vite proxy simplifies local API routing by forwarding frontend requests to the backend. Production deployments still require appropriate API configuration and CORS settings.

📦 Database Schema

Subject Collection

Field

Type

Description

code

String

Original subject code

codeNormalized

String

Normalized subject code

credits

Number

Subject credit value

name

String

Subject name

createdAt

Date

Creation timestamp

updatedAt

Date

Last update timestamp

MissingSubject Collection

Field

Type

Description

code

String

Subject code not found

name

String

Subject name, if available

count

Number

Number of recorded searches

lastSearched

Date

Most recent search timestamp

createdAt

Date

Creation timestamp

updatedAt

Date

Last update timestamp

☁️ Deployment

Frontend — Vercel

The React frontend is deployed on Vercel.

Configure the frontend environment variable in the Vercel project settings:

VITE_API_URL=<YOUR_RENDER_BACKEND_URL>

Use the actual backend URL from your Render service dashboard. Ensure the frontend API client reads this variable correctly.

Backend — Render

The Express.js backend is deployed on Render.

Configure the environment variables in the Render service's environment settings:

MONGODB_URI=<YOUR_MONGODB_CONNECTION_STRING>
PORT=5000
FRONTEND_URL=<YOUR_VERCEL_FRONTEND_URL>

Use the port configuration required by the deployed application and Render environment. Do not publish the actual MongoDB connection string.

Database — MongoDB Atlas

MongoDB Atlas stores subject information and credit mappings.

Keep database credentials private.

Configure network access appropriately for the deployed backend.

Use a database user with only the permissions the application requires.

Never commit connection strings containing usernames or passwords.

🔮 Future Enhancements

Persistent Student Accounts: Allow students to save and revisit their academic records securely.

Result Caching: Reduce repeated requests to the IPU examination portal.

Batch Credit Endpoint: Retrieve credits for multiple subjects through a single request.

Result Notifications: Notify users when relevant results become available.

Performance Comparison: Compare semester trends and anonymized academic statistics.

PDF Export: Download academic dashboards as formatted PDFs.

Dark Mode: Add a user-selectable theme.

Automated Testing: Add unit and integration tests for authentication, result parsing, and grade calculations.

🤝 Contributing

Contributions are welcome.

Fork the repository.

Create a feature branch:

git checkout -b feature/amazing-feature

Commit your changes:

git commit -m "Add amazing feature"

Push the branch:

git push origin feature/amazing-feature

Open a Pull Request describing your changes.

📄 License

This project is licensed under the ISC License. Refer to the repository's LICENSE file for the complete license terms.

⚠️ Disclaimer

IPU Score is an independent educational project and is not affiliated with, endorsed by, or officially associated with Guru Gobind Singh Indraprastha University. It interacts with the university's examination portal to retrieve results on behalf of authenticated users.

The dashboard is provided for convenience and informational purposes. Students should verify academic results, grade calculations, and official academic status through the university's official records.

Built with ❤️ using the MERN Stack
