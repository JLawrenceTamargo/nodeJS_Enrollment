const express = require('express');
const router = express.Router();
const {adminRegister} = require('../controller/adminAuth')
const adminController = require('../controller/adminAuth');

router.post('/login',adminController.login);

router.post('/adminRegister', adminController.adminRegister);
router.post('/adminStudentRegister', adminController.adminStudentRegister);

router.get('/adminDeleteRecord/:student_id', adminController.adminDeleteRecord);
router.post('/adminDelete', adminController.adminDelete);

router.get('/adminUpdateRecord/:student_id', adminController.adminUpdateRecord);
router.post('/adminUpdate', adminController.adminUpdate);

router.get('/adminList', adminController.adminList);

module.exports = router;
