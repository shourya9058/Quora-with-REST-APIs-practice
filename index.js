//REST (Representational State Transfer) is an architectural style that defines a set of constraints to be used for creating web services.
//RESTful APIs -> APIs who follow REST rules or protocols.
//Used to perform CRUD operations (create, read, update, delete).

//Read the blog bookmarked in the browser to understand some basic rules for working with REST.

// CRUD Operations:
// GET: retrieves resources
// POST: submits new data to the server
// PUT: updates existing data
// PATCH: update exisitng data partially
// DELETE: removes data

//Resource: jiss bhi data p operations perform kr rhe h usse resource kehte h.

//------------------------------------------------------------------------------ Quora Like Webpage for practice ----------------------------------------------------------------------------------------------

// konsi konsi request kya perform krne k liye use krenge:

// GET       /posts             to get data for all posts
// POST      /posts             to add a new post
// GET       /posts/:id         to get one post(using id)
// PATCH     /posts/:id         to update specific post
// DELETE    /posts/:id         to delete specific post


const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mysql = require("mysql2");
//requiring uuid (iski documentation se copy paste kiya h)
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

app.use(express.urlencoded({extended:true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));

let posts = [ //database nhi h isiliye array use kr rhe h
    {
        // id: "1a", //jb database use krenge tb id automatically bnn jaegi abhi randomly de rhe h
        id: uuidv4(), //using uuid instead
        username : "cristiano",
        content : "Muchas gracias afición, esto es para vosotros, siuuu!",
    },
    {
        id: uuidv4(),
        username : "messi",
        content : "Camaro vo vo ",
    },
    {
        id: uuidv4(),
        username : "mourinho",
        content : "respect respect!",
    },
    
];

app.get("/posts",(req,res)=>{
    res.render("index.ejs", {posts}); //yeh saari posts dikhane k liye use hoga
})

app.get("/posts/new", (req,res)=>{  //new post k liye form k through data lene k liye yeh route chalega
    res.render("new.ejs")
})

app.post("/posts",(req,res)=>{  //form ka data lega aur usko object bnake posts array mein add krdega, isiliye humne form k method mein post aur action mein /post url daala h
    let {username, content} = req.body;
    let id = uuidv4(); //new post k liye new id
    posts.push({id,username, content});
    // res.send("Post method working") {abhi kya h ki hum ek alg page p aate h post create krne k liye aur create k krne baad bs page p yeh message likha aata h but we want ki submit krne k baad hum yeh posts wale page p redirect ho jae with the updated posts toh uske liye we have another method in express}

    res.redirect("/posts"); //yeh redirect krdega aur by default GET request hi bhejega
})

app.get("/posts/:id",(req,res)=>{
    let {id} = req.params;
    let post = posts.find((p)=> id === p.id); //id se match krke wo wala object post name k variable mein store krwa dega
    res.render("show.ejs",{post});
});

//ab unique id generate krne k liye hum use krenge "uuid" name ka ek package jo ki express mein hota h yeh hume automatically unique ids generate krke dega

app.patch("/posts/:id",(req,res)=>{    //edit krne k liye method
    let {id} = req.params;
    let newContent = req.body.content;
    let post = posts.find((p)=> id === p.id); 
    post.content = newContent;
    console.log(post);
    res.redirect("/posts");
});


app.get("/posts/:id/edit",(req,res)=>{ //actually mein edit yha se hoga lekin yeh ultimately upr wala patch method hi use krega request bhejne k liye.

//but forms se sirf GET aur POST request hi jaati h isiliye hum ek package use krenge "method-override" naam ka to send patch request from the form
    let {id} = req.params;
    let post = posts.find((p)=> id === p.id);
    res.render("edit.ejs",{post});
});

app.delete("/posts/:id",(req,res)=>{
    let {id} = req.params;
    posts = posts.filter((p)=> id !== p.id);
    res.redirect("/posts");
})

app.listen(port, function(){
    console.log(`Listening at port ${port}`);
});