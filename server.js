const express = require("express");
const morgan = require("morgan");
const mongoConfig = require("./config");

require("dotenv").config();


const PORT = process.env.PORT || 3001;
const server = express();

server.use(express.json());
server.use(morgan("dev"));

server.get('/', (req, res) => {
    res.status(200).json({
        message: "API UP!"
    });
});

const userRouter = require('./routes/user')
server.use('/user', userRouter)

const productRouter = require('./routes/product')
server.use('/product', productRouter)

server.listen(PORT, () => {
    mongoConfig()
    console.log(`server is listening on ${PORT}`)
})