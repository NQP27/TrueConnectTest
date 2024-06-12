const express = require('express')
const verifyToken = require('../middleware/vetifyToken')
const router = express.Router()
const accounts = require('../models/accounts')
const staffs = require('../models/staffs')
const chairmans = require('../models/chairmans')
const students = require('../models/students')



//GET general information
//Access: Private GV,SV,AD
router.get('/api/lecture/informations/me', verifyToken, async(req, res) => {
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

// GET "responsible class"
// Access: Private GV
router.get('/api/lecture/classes/consult', verifyToken, async(req, res) => {
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
            };
        }));

        // return res.status(200).json({ success: true, data: raw_data })
        return res.json({ success: true, data: data })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})



module.exports = router