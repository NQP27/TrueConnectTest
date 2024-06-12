const express = require('express')
const router = express.Router()

const provinces = require('../models/provinces')
const districts = require('../models/districts')
const wards = require('../models/wards')
const persons = require('../models/persons')
const faculties = require('../models/faculties')
const classes = require('../models/classes')
const students = require('../models/students')
const staffs = require('../models/staffs')
const accounts = require('../models/accounts')
const verifyToken = require('../middleware/vetifyToken')
const subjects = require('../models/subjects')
const registrations = require('../models/registrations')
const lessons = require('../models/lessons')
const isAdmin = require('../middleware/isAdmin')
const chairmans = require('../models/chairmans')

//Add account
//Access: Only Admin
// router.post('/api/control/register', async(req, res) => {
//     const { username, password, person_code, role } = req.body
//     if (!username || !password || !person_code || !role) {
//         return res
//             .status(400)
//             .json({ success: false, msg: "Some fields are undefined. Try again." })
//     }
//     try {
//         const account = await accounts.findOne({ username })
//         if (account) {
//             return res
//                 .status(400)
//                 .json({ success: false, msg: "Username already exists" })
//         }
//         //Hash password
//         const hashedPassword = await argon2.hash(password)
//         const person = await persons.findOne({ person_code })
//         if (!person) {
//             return res
//                 .status(404)
//                 .json({ success: false, msg: "Person code not found" })
//         }
//         const person_id = person._id
//         const newAccount = new accounts({ username, password: hashedPassword, person_id, role })
//         await newAccount.save()
//         const accessToken = jwt.sign({ userId: newAccount._id }, process.env.ACCESS_TOKEN_SECRET)
//         res.json({
//             success: true,
//             msg: "Acount Created",
//             accessToken
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ success: false, message: 'Internal server error' })
//     }
// })

//Add province
//Access: Only Admin
router.post('/api/control/address/provinces', verifyToken, isAdmin, async(req, res) => {
    const { name, province_code } = req.body
    if (!name || !province_code) {
        return res
            .status(400)
            .json({ success: false, msg: "Some fields are undefined. Try again." })
    }
    try {
        const province = await provinces.findOne({ province_code })
        if (province) {
            res.json({ success: false, msg: "Province code already exists" })
        } else {
            const newProvince = new provinces({ name, province_code })
            await newProvince.save()
            res.json({ success: true, new_province: newProvince })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


//Add district
//Access: Only Admin
router.post('/api/control/address/districts', verifyToken, isAdmin, async(req, res) => {
    const { name, district_code, province_code } = req.body
    if (!name || !province_code || !district_code) {
        return res
            .status(400)
            .json({ success: false, msg: "Some fields are undefined. Try again." })
    }
    try {
        const district = await districts.findOne({ province_code })
        if (district) {
            res.json({ success: false, msg: "Distict code already exists" })
        } else {
            const province = await provinces.findOne({ province_code: province_code })
            if (province) {
                const province_id = province._id
                const newDistrict = new districts({ name, province_id, district_code })
                await newDistrict.save()
                res.json({ success: true, new_district: newDistrict })

            } else { res.json({ success: false, msg: "Province code not found." }) }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


//Add ward
//Access: Only Admin
router.post('/api/control/address/wards', verifyToken, isAdmin, async(req, res) => {
    const { name, ward_code, district_code } = req.body
    if (!name || !ward_code || !district_code) {
        return res
            .status(400)
            .json({ success: false, msg: "Some fields are undefined. Try again." })
    }
    try {
        const district = await districts.findOne({ district_code: district_code })
        if (district) {
            const district_id = district._id
            const newWard = new wards({ name, ward_code, district_id })
            await newWard.save()
            res.json({ success: true, new_ward: newWard })
        } else { res.json({ success: false, msg: "District code not found." }) }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


//Add person
//Access: Only Admin
router.post('/api/control/persons', verifyToken, isAdmin, async(req, res) => {
    const {
        person_code,
        first_name,
        last_name,
        email,
        citizen_id,
        phone,
        sex,
        ward_code,
        recent_address,
        dob
    } = req.body
    if (!person_code || !first_name || !last_name || !email || !citizen_id ||
        !phone || !sex || !ward_code || !recent_address || !dob) {
        return res
            .status(400)
            .json({ success: false, msg: "Some fields are undefined. Try again." })
    }
    try {
        const check_person_code = await persons.findOne({ person_code })
        const check_citizen_id = await persons.findOne({ citizen_id })
        if (check_person_code) {
            return res
                .status(400)
                .json({ success: false, msg: "Person code already exists." })
        }
        if (check_citizen_id) {
            return res
                .status(400)
                .json({ success: false, msg: "Citizen ID already exists." })
        }
        const ward = await wards.findOne({ ward_code: ward_code })
        if (ward) {
            const ward_id = ward._id
            const date_dob = new Date(dob)
            console.log(date_dob)
            const newPerson = new persons({
                person_code,
                first_name,
                last_name,
                email,
                citizen_id,
                phone,
                sex,
                ward_id,
                recent_address,
                dob: date_dob
            })
            await newPerson.save()
            res.json({ success: true, new_person: newPerson })
        } else { res.json({ success: false, msg: "Ward code not found." }) }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

//Add faculty
//Access: Only Admin
router.post('/api/control/faculties', verifyToken, isAdmin, async(req, res) => {
    const { name, faculty_code } = req.body
    if (!name || !faculty_code) {
        return res
            .status(400)
            .json({ success: false, msg: "Some fields are undefined. Try again." })
    }
    try {
        const faculty = await faculties.findOne({ faculty_code })
        if (faculty) {
            res.json({ success: false, msg: "Faculty code already exists" })
        } else {
            const newFaculty = new faculties({ name, faculty_code })
            await newFaculty.save()
            res.json({ success: true, new_faculty: newFaculty })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

//Add class
//Access: Only Admin
router.post('/api/control/classes', verifyToken, isAdmin, async(req, res) => {
    const { name, class_code, faculty_code } = req.body
    if (!name || !class_code || !faculty_code) {
        return res
            .status(400)
            .json({ success: false, msg: "Some fields are undefined. Try again." })
    }
    try {
        const faculty = await faculties.findOne({ faculty_code })
        if (faculty) {
            const faculty_id = faculty._id
            const _class = await classes.findOne({ class_code })
            if (_class) {
                res.json({ success: false, msg: "Class code already exists" })
            } else {
                const newClass = new classes({ name, class_code, faculty_id })
                await newClass.save()
                res.json({ success: true, new_class: newClass })
            }
        } else { res.json({ success: false, msg: "Faculty code not found." }) }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

//Add student
//Access: Only Admin
router.post('/api/control/students', verifyToken, isAdmin, async(req, res) => {
    const { person_code, class_code, student_code } = req.body
    if (!person_code || !class_code || !student_code) {
        return res
            .status(400)
            .json({ success: false, msg: "Some fields are undefined. Try again." })
    }
    try {
        const check_person_code = await students.findOne({ person_code })
        const check_student_code = await students.findOne({ student_code })
        if (check_person_code || check_student_code) {
            return res
                .status(400)
                .json({ success: false, msg: "Student already exists" })
        }
        const person = await persons.findOne({ person_code })
        const _class = await classes.findOne({ class_code })
        if (!person) {
            return res
                .status(404)
                .json({ success: false, msg: "Person code not found" })
        }
        if (!_class) {
            return res
                .status(404)
                .json({ success: false, msg: "Class code not found" })
        }
        const person_id = person._id
        const class_id = _class._id
        const newStudent = new students({ person_id, class_id, student_code })
        await newStudent.save()
        res.json({ success: true, new_student: newStudent })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

//Add staff
//Access: Only Admin
router.post('/api/control/staffs', verifyToken, isAdmin, async(req, res) => {
    const { person_code, faculty_code, staff_code } = req.body
    if (!person_code || !faculty_code || !staff_code) {
        return res
            .status(400)
            .json({ success: false, msg: "Some fields are undefined. Try again." })
    }
    try {
        const check_person_code = await staffs.findOne({ person_code })
        const check_staff_code = await staffs.findOne({ staff_code })
        if (check_person_code || check_staff_code) {
            return res
                .status(400)
                .json({ success: false, msg: "Staff already exists" })
        }
        const person = await persons.findOne({ person_code })
        const faculty = await faculties.findOne({ faculty_code })
        if (!person) {
            return res
                .status(404)
                .json({ success: false, msg: "Person code not found" })
        }
        if (!faculty) {
            return res
                .status(404)
                .json({ success: false, msg: "Faculty code not found" })
        }
        const person_id = person._id
        const faculty_id = faculty._id
        const newStaff = new staffs({ person_id, faculty_id, staff_code })
        await newStaff.save()
        res.json({ success: true, new_staff: newStaff })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


//Add subject
//Access: Only Admin
router.post('/api/control/subjects', verifyToken, isAdmin, async(req, res) => {
    const { name, subject_code, credits } = req.body
    if (!name || !subject_code || !credits) {
        return res
            .status(400)
            .json({ success: false, msg: "Some fields are undefined. Try again." })
    }
    try {
        const subject = await subjects.findOne({ subject_code })
        if (subject) {
            return res
                .status(400)
                .json({ success: false, msg: "Subject already exists" })
        }
        const newSubject = new subjects({ credits, name, subject_code })
        await newSubject.save()
        res.json({ success: true, new_subject: newSubject })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


//Add registration
//Access: Only Admin
router.post('/api/control/registrations', verifyToken, isAdmin, async(req, res) => {
    const { subject_code, student_code, group_code, lecture_code } = req.body
    if (!subject_code || !student_code || !group_code || !lecture_code) {
        return res
            .status(400)
            .json({ success: false, msg: "Some fields are undefined. Try again." })
    }
    try {
        const lecture = await staffs.findOne({ staff_code: lecture_code })
        const subject = await subjects.findOne({ subject_code })
        const student = await students.findOne({ student_code })
        if (!subject) {
            return res
                .status(404)
                .json({ success: false, msg: "Subject code not found" })
        }
        if (!lecture) {
            return res
                .status(404)
                .json({ success: false, msg: "Lecture code not found" })
        }
        if (!student) {
            return res
                .status(404)
                .json({ success: false, msg: "Student code not found" })
        }
        const subject_id = subject._id
        const student_id = student._id
        const lecture_id = lecture._id
        const check_duplicate = await registrations.findOne({ student_id, subject_id })
        if (check_duplicate) {
            return res
                .status(400)
                .json({ success: false, msg: "You have already enroll this subject" })
        }
        const newRegistration = new registrations({ subject_id, student_id, group_code, lecture_id })
        await newRegistration.save()
        res.json({ success: true, new_registration: newRegistration })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

//Add lesson
//Access: Only Admin
router.post('/api/control/lessons', verifyToken, isAdmin, async(req, res) => {
    const { lecture_code, subject_code, date, group_code } = req.body
    if (!lecture_code || !subject_code || !date || !group_code) {
        return res
            .status(400)
            .json({ success: false, msg: "Some fields are undefined. Try again." })
    }
    try {
        const subject = await subjects.findOne({ subject_code })
        const lecturer = await staffs.findOne({ staff_code: lecture_code })
        if (!subject) {
            return res
                .status(404)
                .json({ success: false, msg: "Subject code not found" })
        }
        if (!lecturer) {
            return res
                .status(404)
                .json({ success: false, msg: "Lecturer code not found" })
        }
        const subject_id = subject._id
        const lecturer_id = lecturer._id
        const _date = new Date(date)

        const check_duplicate = await lessons.findOne({ subject_id, group_code, date })
        if (check_duplicate) {
            return res
                .status(400)
                .json({ success: false, msg: "This lesson already takens" })
        }
        const newLesson = new lessons({ subject_id, lecturer_id, group_code, date: _date })
        await newLesson.save()
        res.json({ success: true, new_lesson: newLesson })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

//Add chairman
//Access: Only Admin
router.post('/api/control/chairmans', verifyToken, isAdmin, async(req, res) => {
    const { chairman_code, class_code } = req.body
    if (!chairman_code || !class_code) {
        return res
            .status(400)
            .json({ success: false, msg: "Some fields are undefined. Try again." })
    }
    try {
        const chairman = await staffs.findOne({ staff_code: chairman_code })
        const _class = await classes.findOne({ class_code })
        if (!chairman) {
            res
                .status(404)
                .json({ success: false, msg: "Chairman code not found" })
        }
        if (!_class) {
            res
                .status(404)
                .json({ success: false, msg: "Class code not found" })
        }
        const chairman_id = chairman._id
        const class_id = _class._id
        const newChairman = new chairmans({ chairman_id, class_id })
        await newChairman.save()
        res.json({ success: true, new_chairman: newChairman })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})



module.exports = router