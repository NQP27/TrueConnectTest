const express = require('express')
const verifyToken = require('../middleware/vetifyToken')
const accounts = require('../models/accounts')
const classes = require('../models/classes')
const students = require('../models/students')
const registrations = require('../models/registrations')
const lessons = require('../models/lessons')
const attendance = require('../models/attendance')
const router = express.Router()

//GET general information
//Access: Private GV,SV,AD
router.get('/api/student/informations/me', verifyToken, async(req, res) => {
    try {
        const account_id = req.userId
        const raw_data = await accounts.findOne({ _id: account_id })
            .populate({
                path: 'person_id',
                populate: {
                    path: "ward_id",
                    select: "name",
                    populate: {
                        path: "district_id",
                        select: "name",
                        populate: {
                            path: "province_id",
                            select: "name",
                        }
                    }
                }
            })
        const {
            username,
            person_id: {
                person_code,
                first_name,
                last_name,
                email,
                citizen_id,
                phone,
                sex: gender,
                dob: birthday,
                recent_address,
                ward_id: {
                    name: ward,
                    district_id: {
                        name: district,
                        province_id: {
                            name: province
                        }
                    }
                }
            },
            role,
            createdAt: created_at

        } = raw_data

        const result = {
            account_id,
            username,
            person_code,
            first_name,
            last_name,
            email,
            citizen_id,
            phone,
            gender,
            birthday,
            recent_address,
            ward,
            district,
            province,
            role,
            created_at
        }
        return res.status(200).json({ success: true, data: result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

//GET group classes
//Access: Private SV
router.get('/api/student/group-class', verifyToken, async(req, res) => {
    try {
        const account_id = req.userId

        const person = await accounts.findOne({ _id: account_id })
        const person_id = person.person_id

        const student = await students.findOne({ person_id })
        const student_id = student._id

        const raw_data = await registrations.find({ student_id })
            .populate([{
                path: "subject_id",
                select: ["subject_code", "name"]
            }, {
                path: "student_id",
                select: "student_code",
                populate: {
                    path: "person_id",
                    select: ["first_name", "last_name"]
                }
            }, {
                path: "lecturer_id",
                select: null,
                populate: {
                    path: "person_id",
                    select: ["first_name", "last_name"]
                }
            }])


        if (!raw_data.length) {
            return res.status(404).json({ message: 'Subjects not found' });
        }

        const data = raw_data.map((item) => {
            const subject_code = item.subject_id.subject_code
            const subject_name = item.subject_id.name
            const student_code = item.student_id.student_code
            const student_fullname = `${item.student_id.person_id.first_name} ${item.student_id.person_id.last_name}`
            const lecture_fullname = `${item.lecturer_id.person_id.first_name} ${item.lecturer_id.person_id.last_name}`
            const group_code = item.group_code
            return {
                student_code,
                student_fullname,
                subject_code,
                subject_name,
                group_code,
                lecture: lecture_fullname
            }
        })

        // res.json({ success: true, data: raw_data[0] })
        res.json({ success: true, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})



//GET group class detail
//Access: Private SV
router.get('/api/student/group-class/:group_code', verifyToken, async(req, res) => {
    try {
        const { group_code } = req.params
        const raw_data = await registrations.find({ group_code })
            .populate({
                path: "student_id",
                select: "student_code",
                populate: [{
                        path: "person_id",
                        select: ["first_name", "last_name", "dob"]
                    },
                    {
                        path: "class_id",
                        select: "class_code"
                    }
                ]
            })
        if (!raw_data.length) {
            return res.status(404).json({ message: 'No registrations found for the given group code' });
        }
        let data = {}
        raw_data.forEach((item, index) => {
            const student_code = item.student_id.student_code
            const student_fullname = `${item.student_id.person_id.first_name} ${item.student_id.person_id.last_name}`
            const dob = item.student_id.person_id.dob
            const class_code = item.student_id.class_id.class_code
            data[index] = {
                student_code,
                fullname: student_fullname,
                class_code,
                dob
            }
        })
        return res
            .status(200)
            // .json({ success: true, data: raw_data[0] })
            .json({ success: true, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})



//GET class's students
//Access: Private SV
router.get('/api/student/class/:class_code', verifyToken, async(req, res) => {
    try {
        const { class_code } = req.params
        const _class = await classes.findOne({ class_code })
        const class_id = _class._id
        const raw_data = await students.find({ class_id })
            .populate({
                path: "person_id",
                select: ["first_name", "last_name", "dob"]
            })
        if (!raw_data.length) {
            return res.status(404).json({ message: 'Class not found' });
        }
        let data = {}
        raw_data.forEach((item, index) => {
            const student_code = item.student_code
            const dob = item.person_id.dob
            const student_fullname = `${item.person_id.first_name} ${item.person_id.last_name}`
            data[index] = {
                student_code,
                student_fullname,
                class_code,
                dob
            }
        })
        return res
            .status(200)
            // .json({ success: true, data: raw_data })
            .json({ success: true, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

//GET lessons
//Access: Private GV, AD
router.get('/api/student/lessons', verifyToken, async(req, res) => {
    try {
        const account_id = req.userId

        const person = await accounts.findOne({ _id: account_id })
        const person_id = person.person_id

        const student = await students.findOne({ person_id })
        const student_id = student._id

        const registrationsList = await registrations.find({ student_id });
        const group_codes = registrationsList.map(registration => registration.group_code)

        const raw_data = await lessons.find({ group_code: { $in: group_codes } })
            .populate([{
                path: "subject_id",
                select: ["subject_code", "name"]
            }, {
                path: "lecturer_id",
                select: [],
                populate: {
                    path: "person_id",
                    select: ["first_name", "last_name"]
                }
            }])

        const data = raw_data.map((item) => {
            const class_id = item._id
            const subject_code = item.subject_id.subject_code
            const subject_name = item.subject_id.name
            const lecturer_name = `${item.lecturer_id.person_id.first_name} ${item.lecturer_id.person_id.last_name}`
            const date = item.date
            return {
                class_id,
                subject_code,
                subject_name,
                lecturer_name,
                date
            }
        })
        console.log(group_codes)
        return res.status(200).json({ success: true, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})



//GET roll call 
//Access: Private HS
router.get('/api/student/lessons/roll-call/:lesson_id', verifyToken, async(req, res) => {
    const { lesson_id } = req.params
    try {
        const account_id = req.userId

        const person = await accounts.findOne({ _id: account_id })
        const person_id = person.person_id

        const student = await students.findOne({ person_id })
        const student_id = student._id

        const raw_data = await attendance.findOne({ student_id, lesson_id })
            .populate({
                path: "lesson_id",
                select: ["group_code", "date"],
                populate: [{
                        path: "lecturer_id",
                        select: null,
                        populate: {
                            path: "person_id",
                            select: ["first_name", "last_name"]
                        }

                    },
                    {
                        path: "subject_id",
                        select: ["subject_code", "name"]
                    }
                ]
            })

        const {
            lesson_id: {
                subject_id: {
                    subject_code,
                    name: subject_name
                },
                lecturer_id: {
                    person_id: {
                        first_name,
                        last_name
                    }
                },
                group_code
            },
            date,
            is_attended
        } = raw_data;

        const lecture_fullname = `${first_name} ${last_name}`;

        const data = {
            subject_code,
            subject_name,
            lecture_fullname,
            group_code,
            date,
            is_attended
        };
        // return res.status(200).json({ success: true, data: raw_data })
        return res.status(200).json({ success: true, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


module.exports = router