## Table of Contents
- [Giới thiệu](#gioi_thieu)
- [Cấu trúc thư mục](#cau_truc_thu_muc)
- [Công nghệ](#cong_nghe)
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
## Mô hình ERD cơ sở dữ liệu
![Database](https://github.com/NQP27/TrueConnectTest/blob/main/server/database.jpg)
- Mapping:
![Mapping](https://github.com/NQP27/TrueConnectTest/blob/main/server/mapping_database.png)
## Routes
- auth.js: Người dùng đăng nhập vào hệ thống
  + endpoit: '/api/auth/login', method: POST
- control.js: Nghiệp vụ thêm dữ liệu vào database (Only Admin)



