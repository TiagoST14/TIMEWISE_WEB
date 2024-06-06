const mongoose = require('mongoose')
const express = require('express')

const app = express()

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

//rota inicial - endpoint
app.get('/', (req, res) => {


    res.json({ message: "Servidor online!" })
});

mongoose.connect('mongodb://localhost:27017')
        .then(() => {
            console.log("Conectado!")
            app.listen(3000)
        })
        .catch((err) => console.log(err))