## Giới thiệu
- Đây là một project cá nhân về hệ thống quản lý sinh viên, giảng viên và quản lý việc điểm danh của sinh viên
## Cấu trúc thư mục
server/  
├── middleware/  
│ ├── isAdmin.js  
│ ├── isLecturer.js  
│ ├── verifyToken.js  
├── models/  
│ ├── accounts.js  
│ ├── attendance.js  
│ ├── chairmans.js  
│ ├── classes.js  
│ ├── districts.js  
│ ├── faculties.js  
│ ├── lessons.js  
│ ├── persons.js  
│ ├── registrations.js  
│ ├── staffs.js  
│ ├── students.js  
│ ├── subjects.js  
│ ├── wards.js  
├── routes/  
│ ├── auth.js  
│ ├── control.js  
│ ├── lecturer.js  
│ ├── student.js  
├── .env  
└── index.js  

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

