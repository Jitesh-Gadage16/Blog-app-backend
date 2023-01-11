const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        default: null
    },
    userid:{
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
   
})

module.exports = mongoose.model("blog", blogSchema)

