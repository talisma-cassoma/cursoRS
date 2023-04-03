
const express = require('express');
const {v4: uuidv4}= require('uuid');
const app = express();

const customers = [];

//middleware
app.use(express.json());

//create a account route
app.post('/account',(request, response)=>{

   const {cpf, name}= request.body;

   customers.push({
      id: uuidv4(),
      name,
      cpf,  
      statement: []
   });

   console.log("account:", customers);
   return response.satus(201).send("account created sucessfully!");
});

//PORTA
app.listen(3333, ()=>{
    console.log('server started XD');
});