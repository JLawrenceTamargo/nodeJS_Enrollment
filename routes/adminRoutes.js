const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    res.render('index');
});
router.get('/adminRegister', (req, res) =>{
    res.render('adminRegister');
});
router.get('/adminStudentRegister', (req, res) =>{
    res.render('adminStudentRegister');
});

module.exports = router;