//gets classroom schema
const Classroom = require('../models/Classroom')
//gets the short id library
const { default: ShortUniqueId } = require('short-unique-id');
//defines the char that can be used in the ids
var uid = new ShortUniqueId({dictionary: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']});
//creates another random id that generates a number thats between 5-7 which defines how many charecters the codes will be 
var lengthConstructor = new ShortUniqueId({dictionary: [5, 6, 7]});
//Gets AuthController
const Auth = require('../controllers/authController')
//Gets Class Student Schema
const ClassStudentSchema = require('../models/ClassStudentMaster');
//handles codes error
var express = require('express')
var cookieParser = require('cookie-parser')
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { code: ''};
  
    // incorrect email
    if (err.message === 'That Code Doesnt Exist') {
      errors.code = "That Code Doesn't Exist";
    }
  
    return errors;
  }
// a function that generates a code for the classroom
function generateClassroomCode()
{
    var length = lengthConstructor.randomUUID(1);
    return uid.randomUUID(length);
}

module.exports.createClassroom_get = (req, res) => {
    res.render('createClassroom');
  }

//creates a classroom with the title and subject that were sent from the frontend and adds a row ti the db
module.exports.createClassroom = async (req, res) =>
{
    const {title, subject} = req.body;

    try 
    {
        var classroomCode = generateClassroomCode();
        const classroom = await Classroom.create({title, subject, classroomCode});
        res.status(200).json({classroom: classroom._id, ClassCode: classroom.classroomCode});
    }
    catch(err)
    {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

//finds the classroom by searching with the class code
module.exports.joinClassroom = async (req, res) =>
{
    const ClassCode = req.body;
    const studentIdPre = req.signedCookies;
    const userid = studentIdPre.userid;
    try
    {
        const classroom = await Classroom.joinClassroom(ClassCode);
        const classId = classroom.classroomId;
        const ClassStudent = await ClassStudentSchema.create({userid, classId});
        res.status(200);
        res.json({title: classroom.title, ClassCode: classroom.classroomCode, subject: classroom.subject});
    }
    catch(err)
    {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}
//sends the code and the html(from the frontend) to the schema which searches with the code and makes the field as the html 
module.exports.saveHtml = async (req,res) =>
{
    const {templateHtml, classroomCode} = req.body;
    
    console.log(templateHtml)
    try
    {
        const classroomHTML = await Classroom.addHTML(classroomCode, templateHtml);
        console.log(classroomHTML);
        res.status(200).json({classroom: classroomHTML.templateHtml});
    }
    catch(err)
    {
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }
}
//uses the code to find the html and sends it back
module.exports.getHtml = async (req, res) =>
{
    const {code} = req.body;
    try
    {
        const HTML = await Classroom.loadHTML(code);
        res.status(200).json({HTML});    
    }
    catch(err)
    {
        const errors = handleErrors(err);
        res.status(400).json({errors})
    }
}

module.exports.loadClasses = async(req, res) =>
{
    const studentIdPre = req.signedCookies;
    const studentId = studentIdPre.userid;
    try
    {
        console.log(studentId);
        const classLoaded = await ClassStudentSchema.loadClasses(studentId);
        console.log(classLoaded);
    }
    catch(err)
    {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}