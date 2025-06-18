# Student Progress Management System

A full-stack MERN application designed to manage and visualize student progress using data from the Codeforces API. This system provides a comprehensive dashboard for tracking contest performance, problem-solving metrics, and automated inactivity detection.

<br/>



<!-- It's highly recommended to take a screenshot of your app and upload it to a service like imgur.com, then replace this link. -->

 ![Image](https://github.com/user-attachments/assets/8c86cc92-fdef-4259-b757-3d2252745cb0)


<br/>

## Table of Contents

- [Demo Video](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Author](#author)

## Demo Video

[Link to your live demo] <!-- If you deploy this project (e.g., on Vercel/Netlify for frontend, Render/Heroku for backend), put the link here. -->

## Features

- **Student Management (CRUD):**
  - Add, view, edit, and delete student records.
  - Download the entire student dataset as a `.csv` file.
- **Real-time Data Sync:**
  - On adding a new student or updating their Codeforces handle, data is fetched immediately from the Codeforces API.
- **Automated Daily Sync:**
  - A background cron job runs daily (default at 2 AM) to fetch updated Codeforces data for all enrolled students, minimizing live API calls during user interaction.
  - Last synced timestamp is displayed for each student.
- **Detailed Student Profile:**
  - **Contest History:**
    - Interactive rating graph with filtering for the last 30, 90, or 365 days.
    - A detailed list of contests showing rating changes and ranks.
  - **Problem Solving Data:**
    - Key metrics like total problems solved, average problems per day, and average problem rating, filterable by 7, 30, or 90 days.
    - Bar chart visualizing problems solved per rating bucket.
    - GitHub-style submission heatmap.
- **Inactivity Detection & Notifications:**
  - Automatically identifies students with no submissions in the last 7 days.
  - Sends a friendly reminder email to inactive students.
  - Tracks the number of reminders sent and allows disabling notifications per student.
- **Modern UI/UX:**
  - Fully responsive design for desktop, tablet, and mobile.
  - Seamless light and dark mode toggle.
  - Built with Material-UI for a clean and professional interface.

## Tech Stack

- **Frontend:**
  - **React.js**: Core UI library.
  - **Redux Toolkit**: State management.
  - **Material-UI (MUI)**: Component library for UI design and responsiveness.
  - **Recharts**: For creating interactive charts.
  - **React Router**: For client-side routing.
  - **Axios**: For making API requests.
- **Backend:**
  - **Node.js**: JavaScript runtime environment.
  - **Express.js**: Web application framework for building the REST API.
  - **MongoDB**: NoSQL database for storing student and Codeforces data.
  - **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
- **Services & Tools:**
  - **Codeforces API**: Source of all student contest and submission data.
  - **Node Cron**: For scheduling the daily background jobs.
  - **Nodemailer / SendGrid**: For sending automated emails.

## Project Architecture

The project is structured as a monorepo with two main folders: `client` and `server`.

- **`/client`**: Contains the entire React frontend application, structured with features, components, pages, and Redux state management.
- **`/server`**: Contains the Node.js/Express backend, with a clear separation of concerns for routes, controllers, models, and services (Codeforces API logic, cron jobs, email service).

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- A [SendGrid](https://sendgrid.com/) account or a Gmail account with an "App Password" for the email service.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Binary0011247/student-progress-tracker.git
    cd student-progress-tracker
    ```

2.  **Setup the Backend Server:**
    ```bash
    cd server
    npm install
    cp .env.example .env  # Create your .env file from the example
    ```
    - Now, open `server/.env` and fill in the required environment variables (see below).
    - Start the backend server:
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:5001`.

3.  **Setup the Frontend Client:**
    - Open a new terminal window.
    ```bash
    cd client
    npm install
    ```
    - Start the frontend development server:
    ```bash
    npm start
    ```
    The React application will open in your browser at `http://localhost:3000`.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the `/server` directory:

-   `PORT`: The port for the backend server (e.g., `5001`).
-   `MONGO_URI`: Your MongoDB connection string.
-   `CRON_SCHEDULE`: The schedule for the daily sync job in cron format (e.g., `"0 2 * * *"` for 2 AM daily).
-   **For Email Service (choose one):**
    -   **SendGrid:**
        -   `SENDGRID_API_KEY`: Your API key from SendGrid.
        -   `SENDGRID_FROM_EMAIL`: The email address you have verified as a Sender Identity in SendGrid.
   

## API Endpoints

A brief overview of the available API routes:

| Method | Endpoint                | Description                                |
| :----- | :---------------------- | :----------------------------------------- |
| `GET`  | `/api/students`         | Get all enrolled students.                 |
| `POST` | `/api/students`         | Create a new student and trigger sync.     |
| `GET`  | `/api/students/:id`     | Get a single student by their ID.          |
| `PUT`  | `/api/students/:id`     | Update a student's details.                |
| `DELETE`| `/api/students/:id`     | Delete a student.                          |
| `GET`  | `/api/students/download`| Download all student data as a CSV file.   |

## Screenshots

<!-- Add more screenshots here to showcase your work -->

**Student Profile - Contest History**
<br/>
<img src="https://drive.google.com/file/d/1k7dWG7p3wumDFoN2eIwB1aecWv5ZXUSv/view?usp=sharing" alt="Contest History Screenshot">
<br/>
<br/>

**Student Profile - Problem Solving Data**
<br/>
<img src="https://drive.google.com/file/d/1k7dWG7p3wumDFoN2eIwB1aecWv5ZXUSv/view?usp=sharing" alt="Problem Data Screenshot">
<br/>

## Author

- **Shubh Gupta**
- GitHub: [@Binary0011247](https://github.com/Binary0011247)
- LinkedIn:www.linkedin.com/in/shubh-gupta-453855300
