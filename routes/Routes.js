const { render } = require('ejs');
const { Router } = require('express');
const authController = require('../controllers/authController');
const express = require("express");
const classroomController = require('../controllers/classroomController');
const assignmentController = require('../controllers/assignmentController');


const router = Router();
const app = express();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.get('/getId', authController.getUserId);
router.post('/CreateClassroom', classroomController.createClassroom);
router.post('/JoinClassroom', classroomController.joinClassroom);
router.post('/postHtml', classroomController.saveHtml);
router.post('/getHtml', classroomController.getHtml);
router.get('/loadClasses', classroomController.loadClasses);
router.post('/createAssignment', assignmentController.createAssignment);



module.exports = router;