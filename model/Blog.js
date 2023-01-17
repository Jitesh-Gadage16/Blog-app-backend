const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        default: null
    },
    discription:{
        type: String,
        default: null
    },
    blogimg:{
        type: String,
        default: null
    },
    userDetails:{
        type:Object,
        default: null
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    categoryid:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    content:{
        type: String,
        default: null
    },
    blogdate:{
        type: Date,
        default: Date.now
    },
   
},
{
    timestamps:true
}
)

module.exports = mongoose.model("blog", blogSchema)

