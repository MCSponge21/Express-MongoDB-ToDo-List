const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
// Replace the uri string with your connection string.
const uri = "mongodb+srv://jjgbgames8:Peni$$1212@cluster0.7vuonjb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const main = document.getElementById('main');
async function run() {
  try {
    const database = client.db('todo_list');
    const tasks = database.collection('tasks');
    // Query for a movie that has the title 'Back to the Future'
    const task = await tasks.find().toArray();
    for(i = 0; i < task.length; i++){
        const block = document.createElement('div');
        block.classList.add('block');
        const text = document.createElement('div');
        text.classList.add('task');
        block.appendChild(text);
        main.appendChild(block);
    };
    console.log(task);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);