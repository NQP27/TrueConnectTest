const express = require('express')
const verifyToken = require('../middleware/vetifyToken')
const router = express.Router()
const accounts = require('../models/accounts')
const staffs = require('../models/staffs')
const chairmans = require('../models/chairmans')
const students = require('../models/students')
const classes = require('../models/classes')
const registrations = require('../models/registrations')
const isLecturer = require('../middleware/isLecturer')
const lessons = require('../models/lessons')
const attendance = require('../models/attendance')


//GET general information
//Access: Private GV,SV,AD
router.get('/api/lecturer/informations/me', verifyToken, async(req, res) => {
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
        const data = {
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
        return res.json({ success: true, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

// GET consult classes
// Access: Private GV, AD
router.get('/api/lecturer/classes/consult', verifyToken, isLecturer, async(req, res) => {
    try {
        const account_id = req.userId

        const account = await accounts.findOne({ _id: account_id })
        const person_id = account.person_id

        const staff = await staffs.findOne({ person_id })
        const staff_id = staff._id

        const raw_data = await chairmans.find({ chairman_id: staff_id })
            .populate({
                path: "class_id",
                select: ["class_code", "name"],
                populate: {
                    path: "faculty_id",
                    select: "name"
                }
            })


        if (!raw_data.length) {
            res.status(200).json({ success: true, msg: "Classes not found" })
        }
        const data = await Promise.all(raw_data.map(async(item) => {
            const class_code = item.class_id.class_code;
            const class_name = item.class_id.name;
            const faculty_name = item.class_id.faculty_id.name;
            const class_id = item.class_id._id;

            // Đếm số lượng sinh viên trong lớp
            const class_size = await students.countDocuments({ class_id });

            return {
                class_code,
                class_name,
                faculty_name,
                class_size
            }
        }))

        // return res.status(200).json({ success: true, data: raw_data })
        return res.json({ success: true, data: data })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

// GET consult classdetail
// Access: Private GV,AD
router.get('/api/lecturer/classes/consult/:class_code', verifyToken, isLecturer, async(req, res) => {
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

//GET teach class
//Access: Private AD, GV
router.get('/api/lecturer/classes/teach', verifyToken, isLecturer, async(req, res) => {
    try {
        const account_id = req.userId

        const account = await accounts.findOne({ _id: account_id })
        const person_id = account.person_id

        const staff = await staffs.findOne({ person_id })
        const staff_id = staff._id
        const raw_data = await registrations.find({ lecturer_id: staff_id })
            .populate({
                path: "subject_id",
                select: ["subject_code", "name"]
            })
        if (!raw_data.length) {
            return res.status(404).json({ success: false, msg: "Group class not found" })
        }
        const seenGroupCodes = new Set();

        const data = await Promise.all(raw_data.map(async(item) => {
                if (!seenGroupCodes.has(item.group_code)) {
                    seenGroupCodes.add(item.group_code);
                    const subject_code = item.subject_id.subject_code
                    const subject_name = item.subject_id.name
                    const group_code = item.group_code
                    const class_size = await registrations.countDocuments({ group_code })
                    return {
                        subject_code,
                        subject_name,
                        group_code,
                        class_size
                    }
                }
            }))
            // return res.status(200).json({ success: false, data: raw_data })
        return res.status(200).json({ success: false, data: data.filter(item => item != null) })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


//GET teach class detail
//Access: Private AD, GV
router.get('/api/lecturer/classes/teach/:group_code', verifyToken, isLecturer, async(req, res) => {
    const { group_code } = req.params
    try {
        const raw_data = await registrations.find({ group_code })
            .populate({
                path: "student_id",
                select: "student_code",
                populate: [{
                    path: "person_id",
                    select: ["first_name", "last_name", "dob"]
                }, {
                    path: "class_id",
                    select: "class_code"
                }]
            })
        if (!raw_data.length) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }
        const data = raw_data.map((item) => {
                const student_code = item.student_id.student_code
                const student_fullname = `${item.student_id.person_id.first_name} ${item.student_id.person_id.last_name}`
                const dob = item.student_id.person_id.dob
                const class_code = item.student_id.class_id.class_code
                return {
                    student_code,
                    fullname: student_fullname,
                    class_code,
                    dob
                }
            })
            // return res.status(200).json({ success: true, data: raw_data })
        return res.status(200).json({ success: true, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


//GET lessons list
//Access: Private GV, AD
router.get('/api/lecturer/lessons', verifyToken, isLecturer, async(req, res) => {
    try {
        const account_id = req.userId

        const account = await accounts.findOne({ _id: account_id })
        const person_id = account.person_id

        const staff = await staffs.findOne({ person_id })
        const staff_id = staff._id
        const raw_data = await lessons.find({ lecturer_id: staff_id })
            .populate({
                path: "subject_id",
                select: ["subject_code", "name"]
            })
        if (!raw_data.length) {
            return res.status(404).json({ success: false, message: 'Class not found' });
        }

        const data = raw_data.map((item) => {
                const lesson_id = item._id
                const subject_code = item.subject_id.subject_code
                const subject_name = item.subject_id.name
                const group_code = item.group_code
                const date = item.date
                return {
                    lesson_id,
                    subject_code,
                    subject_name,
                    group_code,
                    date
                }
            })
            // return res.status(200).json({ success: true, data: raw_data })
        return res.status(200).json({ success: true, data: data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

//POST roll call form
//Access: Private GV, AD
router.post('/api/lecturer/lessons/roll-call/:lesson_id', verifyToken, isLecturer, async(req, res) => {
    try {
        const { lesson_id } = req.params
        const lesson = await lessons.findOne({ _id: lesson_id })
        const group_code = lesson.group_code
        const student_list = await registrations.find({ group_code })

        const form = await Promise.all(student_list.map(async(item) => {
            const student_id = item.student_id
            const is_attended = "0"
            const dup = await attendance.findOne({ lesson_id, student_id })
            if (dup) {
                return { lesson_id, is_attended, student_id, dup: true }
            }
            return { lesson_id, is_attended, student_id, dup: false }
        }))
        const check_dup = form.find(item => item.dup === true)
        if (check_dup) {
            return res
                .status(400)
                .json({ success: false, msg: `Some students are duplicated in the form`, form })
        }
        form.forEach(async(item) => {
            const newRollCall = new attendance({ item })
            await newRollCall.save()
        })
        return res.status(200).json({ success: true, msg: 'Roll call form created', form })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


//PATCH tick roll call
//Access: Private GV, AD
router.patch('/api/lecturer/lessons/roll-call/:lesson_id/:student_id', verifyToken, isLecturer, async(req, res) => {
    const { lesson_id, student_id } = req.params
    try {
        const recentRollCall = await attendance.findOne({ lesson_id, student_id })
        const recent_status = recentRollCall.is_attended
        const new_status = recent_status === "0" ? "1" : "0"
        const updatedRollCall = await attendance.findOneAndUpdate({ lesson_id, student_id }, { is_attended: new_status }, { new: true })

        console.log({ recentRollCall, recent_status, new_status })
        return res
            .status(200)
            .json({ success: true, msg: updatedRollCall })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})




module.exports = router