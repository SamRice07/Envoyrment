const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const classStudentSchema = new mongoose.Schema
({
    userid: 
    {
        type: Number,
    },
    classId: Number
});

classStudentSchema.statics.loadClasses = async function(userid)
{
    const studentId = await parseInt(userid, 10);
    const classes = await this.find({userid: userid})
    if(classes)
    {
        var classIds = classes.map(item => item.classId)
        if(classIds)
        {
            return classIds;
        }
        
    }
}

classStudentSchema.statics.createStudent = async function(userid, classId)
{
    const classStudent = await this.findOne({userid: userid, classId: classId})
    return classStudent;
}

const classStudent = mongoose.model('classStudent', classStudentSchema);

module.exports = classStudent;
