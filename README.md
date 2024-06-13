## Giới thiệu
- Đây là một project cá nhân về hệ thống quản lý sinh viên, giảng viên và quản lý việc điểm danh của sinh viên
## Cấu trúc thư mục

- **app/**: Contains the main application code.
  - **__init__.py**: Initializes the Flask app and sets up extensions.
  - **models.py**: Defines the database models (Student, Teacher, Course, Class, Enrollment, Attendance).
  - **routes.py**: Contains the route definitions for the API endpoints.
  - **config.py**: Contains the configuration settings for the application.
- **migrations/**: Directory for database migration files.
- **venv/**: Virtual environment directory (not included in the repository).
- **.env**: Environment variables file (not included in the repository).
- **run.py**: Entry point to run the Flask application.
- **requirements.txt**: List of Python dependencies.

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/student-management-system.git
    cd student-management-system
    ```

2. **Create a virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install the dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Set up environment variables**:
    Create a `.env` file in the project root directory and add the following variables:
    ```
    DATABASE_URL=sqlite:///db.sqlite
    JWT_SECRET_KEY=your_jwt_secret_key
    ```

5. **Run the database migrations**:
    ```bash
    flask db init
    flask db migrate -m "Initial migration"
    flask db upgrade
    ```

6. **Run the application**:
    ```bash
    python run.py
    ```

## Usage

### API Endpoints

- **Students**:
  - `POST /students`: Add a new student.
  - `GET /students`: Get all students.

- **Teachers**:
  - `POST /teachers`: Add a new teacher.
  - `GET /teachers`: Get all teachers.

- **Courses**:
  - `POST /courses`: Add a new course.
  - `GET /courses`: Get all courses.

- **Classes**:
  - `POST /classes`: Create a new class.
  - `GET /classes`: Get all classes.

- **Enrollments**:
  - `POST /enrollments`: Enroll a student in a class.
  - `GET /enrollments`: Get all enrollments.

- **Attendance**:
  - `POST /attendance`: Record attendance.
  - `GET /attendance`: Get all attendance records.

### Example Requests

#### Add a Student
```bash
curl -X POST http://127.0.0.1:5000/students

## Công nghệ
- Ngôn ngữ: ExpressJS
- Cơ sở dữ liệu: MongoDB
- Quản lý API: REST API
- Authentication: JsonWebToken
## Cơ sở dữ liệu

