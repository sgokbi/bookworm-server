const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config()

const port = process.env.PORT || 5000

app.use(cors());
app.use(bodyParser());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t3lkk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connection err", err)
    const bookCollection = client.db("bookStore").collection("books");

    app.get("/books", (req, res) => {
        bookCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.get("/books/:id", (req, res) => {
        bookCollection.find({ _id: ObjectID(req.params.id) })
            .toArray((err, items) => {
                res.send(items[0]);
            })
    })

    app.post("/addBook", (req, res) => {
        const newBook = req.body;
        console.log("adding book: ", newBook)
        bookCollection.insertOne(newBook)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })
});

app.listen(port, () => {
    console.log(process.env.PORT || port)
})