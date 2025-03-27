#GradeX - Examination Management App

DEMO VIDEO LINKS : 
1. VIDEO 1 - https://drive.google.com/file/d/1YrZ9LA-qPhxWF7R_qYozgivVCddF6Sie/view?usp=drive_link
2. VIDEO 2 -https://drive.google.com/file/d/17tFEilquvfiC0FGI4rlO6aXQrj_o8LnW/view?usp=drive_link
3. VIDEO 3 - https://drive.google.com/file/d/1HjLH21sGHXbhHnayQ6UPq9PvIlpLQrjP/view?usp=drive_link


📌 Problem Statement

With the rise of online education, universities and institutions need a robust, secure, and scalable system to conduct Multiple-Choice Question (MCQ)-based exams. A well-designed system ensures fair assessments, prevents cheating, and provides automated grading for quick and efficient evaluation.

🚀 Challenge

Develop an Examination Management App focused exclusively on MCQ-based assessments. The system should allow faculty to create exams, students to take exams, and admins to monitor and analyze performance. The entire process should be seamless, secure, and scalable.

🔥 Core Features

✅ User Authentication & Role-Based Access

Separate roles for Admins, Faculty, and Students with distinct privileges.

✅ MCQ Exam Creation & Management

Faculty can create exams with a pool of MCQ questions.

AI-generated questions based on topic input.

Time-limited exam options.

✅ Automated Grading & Result Generation

Instant evaluation and result display upon submission.

✅ Real-Time Exam Monitoring

Track student progress and prevent reattempts.

✅ Question Bank Management

Faculty can create, update, and reuse a question pool.

✅ Secure & Cheat Prevention Measures

AI-based Face Authentication & Recognition.

Prevent multiple logins from the same account.

AI monitoring detects multiple faces, gaze tracking, and movement.

Forced tab-switch prevention and full-screen enforcement.

✅ Live Timer & Auto-Submission

Exams automatically submit when time runs out.

✅ Detailed Performance Analytics

Insights for both students and faculty on exam performance.

🛠️ Implementation Details

🔹 Face Authentication & Recognition

Uses AWS S3 Buckets for sign-in verification.

🔹 AI-Generated Questions

Faculty inputs a topic/subtopic to generate questions via AI APIs.

Questions are selected from the AI-generated pool.

🔹 AI Monitoring During Tests

Detects multiple faces in the camera.

Detects gaze movement away from the screen.

Forces closure of all browser extensions.

Prevents tab-switching and ensures full-screen mode.

🏗️ Tech Stack

🔹 Frontend

NextJS, Tailwind CSS, JavaScript, HTML, CSS

🔹 Backend

Python, Flask, AWS

🔹 AI Features

FaceMesh, Gemini API, ManifestV3

🔧 Installation & Setup

Clone the Repository:

git clone https://github.com/your-repo/GradeX.git
cd GradeX

Install Dependencies:

npm install  # for frontend
pip install -r requirements.txt  # for backend

Run the Application:

npm run dev  # Start frontend
python app.py  # Start backend

📌 Contributing

Fork the repository.

Create a feature branch (feature-branch-name).

Commit changes (git commit -m 'Add new feature').

Push to the branch (git push origin feature-branch-name).

Open a Pull Request.
