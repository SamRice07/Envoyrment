const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const classroomSchema = new mongoose.Schema
({
    title:
    {
        type: String,
        required: [true, 'Please Enter A Name For Your Email']
    },
    subject: String,
    classroomCode:
    {
        type: String,
        required:[true],
        unique: [true]
    },
    templateHTML: String,
    classroomId:
    {
        type: Number,
    },
});
classroomSchema.plugin(autoIncrement, {inc_field: 'classroomId'});

classroomSchema.statics.joinClassroom = async function(code) 
{
    const classroom = await this.findOne(code);
    if(classroom)
    {
        return classroom;
    }
    else
    {
        throw Error('That Code Doesnt Exist');
    }
};

classroomSchema.statics.addHTML = async function(classroomCode, html)
{
    const HTML = await this.findOneAndUpdate({classroomCode: classroomCode}, {templateHTML: html},(err) =>
    {
        if(err)
        {
            console.log(err);
        }
    });
    console.log(HTML);
    if(HTML)
    {
        return "Nice";
    }
}

classroomSchema.statics.loadHTML = async function(code)
{
    console.log({classroomCode: code});
    const ClassHtml = await this.findOne({classroomCode: code});
    if(ClassHtml)
    {
        return ClassHtml.templateHTML;
    }
}

classroomSchema.statics.getClass = async function(classroomId)
{
    const Class = await this.findOne({classroomId: classroomId})
    if(Class)
    {
        return Class;
    }
}

classroomSchema.statics.getClassId = async function(classCode)
{
    const Classroom = await this.findOne(classCode);
    if(Classroom)
    {
        return Classroom.classroomId;
    }
}
const Classroom = mongoose.model('classroom', classroomSchema);

module.exports = Classroom;

