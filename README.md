
## Table of Contents
- [Giới thiệu](#giới-thiệu)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Công nghệ](#công-nghệ)
- [Cơ sở dữ liệu](#cơ-sở-dữ-liệu)
- [Routes](#routes)

## Giới thiệu
Đây là một project cá nhân về hệ thống quản lý sinh viên, giảng viên và quản lý việc điểm danh của sinh viên.

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

## Cơ sở dữ liệu
### ERD:
![Database](https://github.com/NQP27/TrueConnectTest/blob/main/server/database.jpg)

### Mapping:
![Mapping](https://github.com/NQP27/TrueConnectTest/blob/main/server/mapping_database.png)

## Routes
### auth.js: Người dùng đăng nhập vào hệ thống
- **Endpoint**: `/api/auth/login`  
  **Method**: POST

### control.js: Nghiệp vụ thêm dữ liệu vào database (Only Admin) 
- **Endpoint**: `/api/control/address/provinces`  
  **Method**: POST  
  **Chức năng**: Thêm các bản ghi tỉnh  
- **Endpoint**: `/api/control/address/districts`  
  **Method**: POST  
  **Chức năng**: Thêm các bản ghi quận/ huyện  
- **Endpoint**: `/api/control/address/wards`  
  **Method**: POST  
  **Chức năng**: Thêm các bản ghi phường/ xã  
- **Endpoint**: `/api/control/persons`  
  **Method**: POST  
  **Chức năng**: Thêm các bản ghi person (bao gồm sinh viên, giảng viên trong trường)  
- **Endpoint**: `/api/control/faculties`  
  **Method**: POST  
  **Chức năng**: Thêm các bản ghi khoa  
- **Endpoint**: `/api/control/classes`  
  **Method**: POST  
  **Chức năng**: Thêm các bản ghi lớp  
- **Endpoint**: `/api/control/students`  
  **Method**: POST  
  **Chức năng**: Thêm các bản ghi sinh viên  
- **Endpoint**: `/api/control/staffs`  
  **Method**: POST  
  **Chức năng**: Thêm các bản ghi nhân viên (giảng viên)  
- **Endpoint**: `/api/control/subjects`  
  **Method**: POST  
  **Chức năng**: Thêm các bản ghi môn học  
- **Endpoint**: `/api/control/registrations`  
  **Method**: POST  
  **Chức năng**: Thêm bản ghi các môn sinh viên đăng ký trong học kỳ này  
- **Endpoint**: `/api/control/lessons`  
  **Method**: POST  
  **Chức năng**: Thêm các bản ghi buổi học  
- **Endpoint**: `/api/control/chairmans`  
  **Method**: POST  
  **Chức năng**: Thêm bản ghi thông tin các cố vấn học tập  

### lecturer.js: Các chức năng dành cho giảng viên  
- **Endpoint**: `/api/lecturer/informations/me`  
  **Method**: GET  
  **Chức năng**: Xem thông tin cá nhân  
- **Endpoint**: `/api/lecturer/classes/consult`  
  **Method**: GET  
  **Chức năng**: Xem các lớp giảng viên đó đang làm cố vấn học tập  
- **Endpoint**: `/api/lecturer/classes/consult/:class_code`  
  **Method**: GET  
  **Chức năng**: Xem danh sách sinh viên của một lớp giảng viên đó làm cố vấn học tập  
- **Endpoint**: `/api/lecturer/classes/teach`  
  **Method**: GET  
  **Chức năng**: Xem danh sách nhóm lớp giảng viên đó đang phụ trách giảng dạy  
- **Endpoint**: `/api/lecturer/classes/teach/:group_code`  
  **Method**: GET  
  **Chức năng**: Xem danh sách sinh viên của một lớp giảng viên đó đang phụ trách giảng dạy  
- **Endpoint**: `/api/lecturer/lessons`  
  **Method**: GET  
  **Chức năng**: Xem danh sách buổi học giảng viên đó phụ trách giảng dạy  
- **Endpoint**: `/api/lecturer/lessons/roll-call/:lesson_id`  
  **Method**: POST  
  **Chức năng**: Thêm biểu mẫu điểm danh cho một buổi học  
- **Endpoint**: `/api/lecturer/lessons/roll-call/:lesson_id/:student_id`  
  **Method**: PATCH  
  **Chức năng**: Tích vắng hoặc có mặt cho một sinh viên  

### student.js: Các chức năng cho sinh viên  
- **Endpoint**: `/api/student/informations/me`  
  **Method**: GET  
  **Chức năng**: Xem thông tin cá nhân  
- **Endpoint**: `/api/student/group-class`  
  **Method**: GET  
  **Chức năng**: Xem thông tin các nhóm lớp mà sinh viên đó đăng ký học  
- **Endpoint**: `/api/student/group-class/:group_code`  
  **Method**: GET  
  **Chức năng**: Xem danh sách sinh viên của một nhóm lớp mà sinh viên đó đăng ký học  
- **Endpoint**: `/api/student/class/:class_code`  
  **Method**: GET  
  **Chức năng**: Xem danh sách sinh viên của lớp chính quy của sinh viên đó  
- **Endpoint**: `/api/student/lessons`  
  **Method**: GET  
  **Chức năng**: Xem danh sách các buổi học  
- **Endpoint**: `/api/student/lessons/roll-call/:lesson_id`  
  **Method**: GET  
  **Chức năng**: Xem tiến trình điểm danh  
