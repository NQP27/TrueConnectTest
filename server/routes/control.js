const express = require('express')
const router = express.Router()
const provinces = require('../models/provinces')
const districts = require('../models/districts')
const wards = require('../models/wards')
const persons = require('../models/persons')
const faculties = require('../models/faculties')


//Thêm tỉnh
router.post('/api/address/provinces', async(req, res) => {
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



//Thêm huyện
router.post('/api/address/districts', async(req, res) => {
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


//Thêm xã
router.post('/api/address/wards', async(req, res) => {
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


//Thêm person
router.post('/api/persons', async(req, res) => {
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
        if (check_person_code) {
            res.json({ success: false, msg: "Person code already taken." })
        }
        const check_citizen_id = await persons.findOne({ citizen_id })
        if (check_citizen_id) {
            res.json({ success: false, msg: "Citizen ID already taken." })
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
            console.log(newPerson)
            await newPerson.save()
            res.json({ success: true, new_person: newPerson })
        } else { res.json({ success: false, msg: "Ward code not found." }) }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

//
router.get('/api/me', async(req, res) => {
    try {
        const me = await persons.findOne({ person_code: 'STD598' })
            .populate({
                path: 'ward_id',
                populate: {
                    path: 'district_id',
                    populate: {
                        path: 'province_id',
                        select: "name"
                    },
                    select: "name"
                },
                select: "name"
            })
        if (me) {
            res.json({ success: true, my_information: me })
        } else {
            res.json({ success: false, msg: "Person not found" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }

})


//Thêm khoa
router.post('/api/faculties', async(req, res) => {
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


module.exports = router