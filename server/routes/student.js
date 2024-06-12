const express = require('express')
const verifyToken = require('../middleware/vetifyToken')
const accounts = require('../models/accounts')
const classes = require('../models/classes')
const students = require('../models/students')
const registrations = require('../models/registrations')
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
        const result = {
            account_id: raw_data._id,
            username: raw_data.username,
            person_code: raw_data.person_id.person_code,
            first_name: raw_data.person_id.first_name,
            last_name: raw_data.person_id.last_name,
            email: raw_data.person_id.email,
            citizen_id: raw_data.person_id.citizen_id,
            phone: raw_data.person_id.phone,
            gender: raw_data.person_id.sex,
            birthday: raw_data.person_id.dob,
            recent_address: raw_data.person_id.recent_address,
            ward: raw_data.person_id.ward_id.name,
            district: raw_data.person_id.ward_id.district_id.name,
            province: raw_data.person_id.ward_id.district_id.province_id.name,
            role: raw_data.role,
            created_at: raw_data.createdAt
        }
        res.json({ success: true, data: result })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

//GET student-subject information
//Access: Private SV
router.get('/api/student/informations/subjects', verifyToken, async(req, res) => {
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
                path: "lecture_id",
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
            const lecture_fullname = `${item.lecture_id.person_id.first_name} ${item.lecture_id.person_id.last_name}`
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



//GET group class's student list
//Access: Private SV
router.get('/api/student/informations/subjects/:group_code', verifyToken, async(req, res) => {
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



//GET class's student list
//Access: Private SV
router.get('/api/student/informations/class/:class_code', verifyToken, async(req, res) => {
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


module.exports = router