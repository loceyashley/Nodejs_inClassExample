//require express
var express = require('express');
//require body parser
var bodyParser = require ("body-parser");

//require mongoose
var mongoose = require("mongoose");

//create express object call express
var app = express();
//create port information
const port = process.env.PORT || 3000;

//tells application to use ejs for templates
app.set('view engine', 'ejs');

//make styles pulic
app.use(express.static("Public"));

//tell app to use body parser
app.use(bodyParser.urlencoded({extended: true}));

//connection info for mongo
const Todo = require('./models/todo.model');
const mongoDB ='mongodb+srv://ashleyL:k0ZMEAhou8R5hABO@cluster0.ndcuj.mongodb.net/todolist?retryWrites=true&w=majority' ;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console,'MongoDB connection error'));

//couple of items to list
var tasks = ["make it to class", "feed the dog"];

//completed items
var completed = ["extra works"];

//get home page
app.get('/',function(req, res){
    //return something to home page
    res.render('index', {tasks: tasks}); //add completed to ejs
});

//add post method /add task
app.post('/addtask',function(req,res){
    var newTask = req.body.newtask;
    tasks.push(newTask);
    //return index 
    res.redirect('/');
});

//remove task
app.post('/removetask', function(req,res){
    var removeTask = req.body.check;
    //push to completed
    if(typeof removeTask === 'string'){
        tasks.splice(tasks.indexOf(removeTask), 1);
    }else if(typeof removeTask === 'object'){
        for(var i = 0; i < removeTask.length; i++){
            tasks.splice(tasks.indexOf(removeTask[i]), 1);
        }
    }
    res.redirect('/');
});

//server setup 
app.listen(port,function(){
    console.log('listening on ' + port)
});