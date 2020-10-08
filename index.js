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
                    completed.push(todo[i].item);
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
        })
        }
    }
    res.redirect('/');
});

app.post('/deleteTodo', function(){
    // write the function for delete using ID
    // handle for single and multiple delete requests (req.body.delete)
    // Todo.deleteOne(id, function(err){})
})

//server setup 
app.listen(port,function(){
    console.log('listening on ' + port)
});