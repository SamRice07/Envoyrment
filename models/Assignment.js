const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const assignmentSchema = new mongoose.Schema
({
    title:
    {
        type: String
    },
    classroomId:
    {
        type:Number,
        required:[true]
    },
    assignmentHTML:
    {
        type: String
    },
    dateCreated:
    {
        type: Date
    },
    assignmentId:
    {
        type:Number
    }
});
assignmentSchema.plugin(autoIncrement, {inc_field: 'assignmentId'});


const Assignment = mongoose.model('assignment', assignmentSchema);

module.exports = Assignment;
