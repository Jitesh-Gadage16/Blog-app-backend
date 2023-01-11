require('dotenv').config()
require("./config/database").connect()
const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
var cookieParser = require('cookie-parser')

//custom middleware
const auth = require('./middleware/auth')

//import model - User
const User = require("./model/User")
const Blog = require("./model/Blog")
const Category = require("./model/Category")

const app = express()
app.use(express.json()) // discuss this later
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Hello auth system")
})

app.post("/register", async (req, res) => {
    try {
        //collect all information
        const { firstname, lastname, email, password } = req.body
        //validate the data, if exists
        if (!(email && password && lastname && firstname)) {
            res.status(401).send("All fileds are required")
        }
        //check if email is in correct format

        //check if user exists or not
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(401).send("User already found in database")
        }

        //encrypt the password
        const myEncyPassword = await bcrypt.hash(password, 10)


        //create a new entry in database
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: myEncyPassword,
        })

        //create a token and send it to user
        const token = jwt.sign({
            id: user._id, email
        }, 'shhhhh', { expiresIn: '2h' })


        user.token = token
        //don't want to send the password
        user.password = undefined

        res.status(201).json(user)


    } catch (error) {
        console.log(error);
        console.log("Error is response route");
    }
})

app.post("/login", async (req, res) => {
    try {
        //collected information from frontend
        const { email, password } = req.body
        //validate
        if (!(email && password)) {
            res.status(401).send("email and password is required")
        }

        //check user in database
        const user = await User.findOne({ email })
        //if user does not exists - assignment
        //match the password
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id, email }, 'shhhhh', { expiresIn: '2h' })


            user.password = undefined
            user.token = token

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.status(200).cookie("token", token, options).json({
                success: true,
                token,
                user
            })

        }
        //create token and send
        res.sendStatus(400).send("email or password is incorrect")
    } catch (error) {
        console.log(error);
    }


})

app.get("/dashboard", auth, (req, res) => {
    res.send('Welcome to dashboard')

})


app.post('/createCategory', auth, async (req, res) => {
    try {
        const { name } = req.body

        if (!name) {
            res.status(401).send("plase enter category name")
        }

        const categoryName = await Category.create({
            name
        })

        console.log(categoryName)

        res.status(200).json({
            success: true,
            message: "successfully Category created",
            categoryName
        })
    } catch (error) {
        console.log(error)
        console.log("error in category controller")
    }
})

app.get('/getCategory', auth, async (req, res) => {

    try {
        const user = req.user.id
        console.log("user detail", user)

        if (!user) {
            res.status(401).send("user not found and you are not allowed")
        }

        const getCategories = await Category.find();

        console.log(getCategories)

        res.status(200).json({
            success: true,
            message: "successfully blog created",
            getCategories
        })

    } catch (error) {
        console.log(error)
    }
})

app.post('/createblog', auth, async (req, res) => {
    try {

        const userid = req.user.id
        console.log("user detail", userid)

        if (!userid) {
            res.status(401).send("user not found and you are not allowed")
        }

        // const value = req.body.id;
        // console.log("value",value)

        // console.log(user.user_id)

        const { title,categoryid, content, } = req.body 

        // const checkCategry = await Category.findOne({categoryid})
        // console.log("check cate",checkCategry.id)

        

        if (!(title && categoryid && content)) {
            res.status(401).send("All fileds are required")
        }

        const blog = await Blog.create({
            title,
            categoryid:categoryid,
            content,
            userid,
        })

        console.log(blog)

        res.status(200).json({
            success: true,
            message: "successfully blog created",
            blog
        })
    } catch (error) {
        console.log(error)
    }
})

app.get('/getAllbogs', auth, async (req, res) => {

    try {
        const user = req.user.id
        console.log("user detail", user)

        if (!user) {
            res.status(401).send("user not found and you are not allowed")
        }

        const getBlogs = await Blog.find();

        console.log(getBlogs)

        res.status(200).json({
            success: true,
            message: "successfully getall blogs",
            getBlogs
        })

    } catch (error) {
        console.log("erro in get blogs", error)
    }
})

app.get('/getBlog', auth, async (req, res) => {
    const categoryId = req.query.categoryId;

    try {

        // const { category } = req.params;

        console.log("category id  mila", categoryId); 
        
        
// const categoryid = categoryId

console.log("dsdsds",categoryId)
        
        const checkBlogexist = await Blog.find({categoryid:categoryId})

        console.log("blog mila ", checkBlogexist)

   

        // if (!checkBlogexist) {
        //     res.status(401).send("user not found and you are not allowed")
        // }

        // const getBlogs = await Blog.findById({ blogId });

        // console.log(getBlogs)

        res.status(200).json({
            success: true,
            message: "successfully blog created",
            checkBlogexist
        })

    } catch (error) {
        console.log("erro in get blog by id", error)
    }
})







module.exports = app