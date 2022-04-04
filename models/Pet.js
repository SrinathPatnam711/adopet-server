const mongoose = require('mongoose')
const Schema =mongoose.Schema;

const petSchema = Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref: 'users'
    },
    name:{
        type : String,
        require :true,
    },
    description:{
        type : String,
        require :true,
    },
    dob:{
        type : String,
        require :false,
    },
    breed:{
        type : String,
        require :true,
    },
    petType:{
        type : String,
        require :true,
    },
    count:{
        type : Number,
        require :true,
    },
    vaccine:{
        type : String,
        require :true,
    },
})

module.exports =mongoose.model('Pet', petSchema)