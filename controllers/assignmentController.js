const assignmentSchema = require('../models/Assignment');
const classroomSchema = require('../models/Classroom');

const handleErrors = (err) => 
{
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    // incorrect email
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }
  
    // incorrect password
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
  
    // duplicate email error
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    // validation errors
    if (err.message.includes('user validation failed')) {
      // console.log(err);
      Object.values(err.errors).forEach(({ properties }) => {
        // console.log(val);
        // console.log(properties);
        errors[properties.path] = properties.message;
      });
    }
}

module.exports.createAssignment = async (req, res) =>
{
    const classCode = req.body;

    try
    {
        const Classroom = await classroomSchema.getClassId(classCode);
        assignmentSchema.create({classroomId: Classroom});
    }
    catch(err)
    {
        console.log(err);
    }
} 