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
## Công nghệ
- Ngôn ngữ: ExpressJS
- API: REST API
- Cơ sở dữ liệu: MongoDB
- Authentication: JSON Web Tokens


