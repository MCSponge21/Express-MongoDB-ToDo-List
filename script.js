const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');

const username = process.env.API_USERNAME;
const password = process.env.PASSWORD;

console.log(process.env);

const uri = `mongodb+srv://${username}:${password}@cluster0.7vuonjb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri);

var taskCount = [];
var editID = 0;



async function run() {
    try{
    const database = client.db('todo_list');
    const tasks = database.collection('tasks');
    const task = await tasks.find().toArray();
    taskCount = task;
    console.log(taskCount);
    app.listen(8080, () =>{
        console.log("success");
    });
} finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
};

async function afterAdd(body){
    try{
        const database = client.db('todo_list');
        const tasks = database.collection('tasks');
        const addTask = await tasks.insertOne(body);
        const task = await tasks.find().toArray();
        taskCount = task;
        console.log(addTask);
    } finally {
        // Ensures that the client will close when you finish/error
       // await client.close();
      }

}

async function afterDelete(ididy){
    try{
        const database = client.db('todo_list');
        const tasks = database.collection('tasks');
        const addTask = await tasks.deleteOne({"_id": new ObjectId(ididy)}, function(err, data){});
        const task = await tasks.find().toArray();
        taskCount = task;
        console.log(addTask);
    } finally {
        // Ensures that the client will close when you finish/error
       // await client.close();
      }
}

async function edit(ididy, change){
    try{
        const database = client.db('todo_list');
        const tasks = database.collection('tasks');
        const addTask = await tasks.updateOne(
            {"_id": new ObjectId(ididy)},
            {$set:{"task": change}
    });
        const task = await tasks.find().toArray();
        taskCount = task;
        console.log(addTask);
    } finally {
        // Ensures that the client will close when you finish/error
       // await client.close();
      }
}

run().catch(console.dir);

//middleware invoked every request sent
app.use('/public', express.static('public'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render("index", {taskCount: taskCount});
});

app.post("/delete/:id", async(req, res) =>{
    await afterDelete(req.params.id);
    console.log(req.params.id);
    res.redirect("/");
});

app.get("/edit/:id", (req, res) =>{
    editID = req.params.id;
    res.render("edit");
});

app.post(`/edit/:${editID}`, async(req, res) =>{
    await edit(editID, req.body.task);
    res.redirect("/");
});

app.get("/post", (req, res) => {
    res.render("post");
});

app.post("/post", async (req, res) => {
    console.log(req.body);
    await afterAdd(req.body);
        res.redirect("/");
    
});