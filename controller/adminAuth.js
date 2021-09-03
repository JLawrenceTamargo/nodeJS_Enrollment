const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

db.connect( (err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    } else {
        console.log("MySQL connected");
    }
});

//Registration export
exports.adminRegister = (req, res) => {
    console.log(req.body);
    const {admin_uid, admin_pass, admin_email, admin_firstname, admin_lastname, admin_passConfirm} = req.body;

    //validation
    db.query(`select admin_email from admin where admin_email = ?`, [admin_email], async (err, result) => {
        if (err) {
            throw err;
        }
        //for results
        if (result > 0) {
            return res.render('adminRegister', {message: 'Email entered already in use.'})
        }
        else if (admin_pass !== admin_passConfirm) {
            return res.render('adminRegister', {message: 'Password entered do not match.'})
        }

        //Encrypt Password
        let encpassAdmin = await bcrypt.hash(admin_pass, 8);
        console.log(encpassAdmin);

        db.query(`insert into admin set ?`, {admin_uid:admin_uid, admin_firstname: admin_firstname, admin_lastname: admin_lastname, admin_email: admin_email, admin_pass:encpassAdmin}, (err, result) => {
            if (err) {
                // throw err;
                console.log(err);
            }
            else {
                console.log(result);
                return res.render('adminRegister', {message: 'User registered!'})
            }
        })
    });
};

exports.adminStudentRegister = (req, res) => {
    console.log(req.body);
    const {student_email, student_fname, student_lname, student_contact} = req.body;
    
    db.query(`insert into enrollment set ?`, {student_fname:student_fname, student_lname:student_lname, student_contact:student_contact, student_email:student_email  }, (err, result) => {
        if (err) {
            // throw err;
            console.log(err);
        }
        else {
            console.log(result);
            return res.render('adminStudentRegister', {message: 'User registered!'})
        }
    });
};

exports.login = (req, res) => {
    const {admin_uid, admin_pass} = req.body;

    if (!admin_uid || !admin_pass) {
        return res.status(400).render('index', {message: 'Please enter valid UID and password.'});
    }

    db.query(`select * from admin where admin_uid = ?`, [admin_uid], async (err, result) => {
        if (!result || !(await bcrypt.compare(admin_pass, result[0].admin_pass))) {
            console.log(err);
            res.status(401).render('index', {message: 'UID or Password is incorrect!'});
        }
        else {
            const id = result[0].student_id;
            const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:process.env.JWTEXPIRESIN});
            console.log(token);
            const cookieOptions = {
                expires: new Date(
                    Date.now()+process.env.COOKIE_EXPIRES *24 *60 * 60 * 1000
                ),
                httpOnly:true
            }
            res.cookie('jwt', token, cookieOptions);
            // res.status(200).redirect('/');
            db.query(`select * from enrollment`, (err, results) => {
                if (err) throw err;
                res.render('list', {title:'List of Enrolled Students', user:results});
            });
            // return res.render('login', {message:'User Logged in.'});
        }
});
};

//delete
exports.adminDeleteRecord = (req, res) => {
    const student_id = req.params.student_id;
    db.query(`select * from enrollment where student_id = ?`, [student_id], (err, result) => {
        if (err) throw err;
        res.render('adminDeleteRecord', {title:'Delete Student Record', user:result[0]});
    });
};
exports.adminDelete = (req, res) => {
    const{student_id} = req.body;
    db.query(`delete from enrollment where student_id = '${student_id}'`, 
    (err, result) => {
        if (err) throw err;
        db.query(`select * from enrollment`, (err, result) => {
            res.render('list', {user:result});
        });
    });
};

//update form
exports.adminUpdateRecord = (req, res) => {
    const student_id = req.params.student_id;
    db.query(`select * from enrollment where student_id = ?`, [student_id], (err, result) => {
        if (err) throw err;
        res.render('adminUpdateRecord', {title:'Update Student Record', user:result[0]});
    });
};

exports.adminUpdate = (req, res) => {
    const{student_id, student_fname, student_lname, student_email, student_contact} = req.body;
    db.query(`update enrollment set student_fname ='${student_fname}', student_lname ='${student_lname}', student_email = '${student_email}', student_contact = '${student_contact}'  where student_id = '${student_id}'`, 
    (err, result) => {
        if (err) throw err;
        db.query(`select * from enrollment`, (err, result) => {
            res.render('list', {user:result});
        });
    });
};

exports.adminList = (req, res) => {
    db.query(`select * from admin`, (err, results) => {
        if (err) throw err;
        res.render('adminList', {title:'List of Admins', user:results});
    });
};