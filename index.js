//require express
var express = require('express');
//require body parser
var bodyParser = require ("body-parser");

//require mongoose
var mongoose = require("mongoose");

//require node-fetch
 var fetch = require('node-fetch');

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
var tasks = [];
//completed items
var completed = [];

//get home page
app.get('/',function(req, res){
    //query to mongoDB for todo
    Todo.find(function(err,todo){
        if(err)
        {
            console.log(err);
        }else{
            tasks=[];
            completed=[];
            for(i =0; i < todo.length; i++)
            {
                if(todo[i].done)
                {
                    completed.push(todo[i])
                }else{
                    tasks.push(todo[i]);

                }
            }
        }
    });
    //return something to home page
    res.render('index', {tasks: tasks,completed: completed}); 
});

//add post method /add task
app.post('/addtask', function(req, res){
    let newTodo = new Todo({
        item: req.body.newtask,
        done: false
    })
    newTodo.save(function(err, todo){
        if (err){
            console.log(err)
        } else {
            //return index
            res.redirect('/');
        }
    });
});

//remove task
app.post('/removetask', function(req,res){
    var id = req.body.check;
    if(typeof id === 'string'){
        Todo.updateOne({_id: id}, {done:true}, function(err){
            if(err){
                console.log(err);
            }
        })
    }else if(typeof id === 'object'){
        for(var i = 0; i < id.length; i++){
            Todo.updateOne({_id: id[i]}, {done:true}, function(err){
                if(err){
                    console.log(err);
                }
                res.redirect('/');
        })
        }
    }
    res.redirect('/');
});

app.post('/deleteTodo', function(req, res){
    var id = req.body.delete;
    if(typeof id === "string"){
        Todo.deleteOne({_id: id}, function(err){
            if (err){
               console.log(err)
            }
        });
    }else if (typeof id === "object"){
        for(var i = 0; i < id.length; i++){
            Todo.deleteOne({_id: id[i]}, function(err){
            if (err){
                console.log(err)
            }
        });
        }
    }
    res.redirect('/');
})

//fetch nasa information and send to front end as JSON data
app.get('/nasa', function(req, res){
    let nasaData;
    fetch('https://api.nasa.gov/planetary/apod?api_key=5ir4S9Edp6wb6mgmQG8JzA1D1i6352XEq4TMxlug',)
    .then(res => res.json())
    .then(data => {
        nasaData = data;
        res.json(nasaData);
    });
})

//get our data for the todo list from Mongo and send to front end as JSON
app.get('/todoListJson', function(req, res){
    //query to mongoDB for todos
    Todo.find(function(err, todo){
        if(err){
            console.log(err);
        }else{
            res.json(todo);
        }
    });
});

//server setup 
app.listen(port,function(){
    console.log('listening on ' + port)
});