
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

const customers = [];

//middleware
app.use(express.json());

//verify 
function verifyIfExisteCPF(request, response, next){

   const{ cpf } = request.headers;
   const customer = customers.find((customer)=> customer.cpf === cpf);
   
   if(!customer){
      return response.status(400).send("account not found!")
   }

   request.customer = customer
   //console.log(request.customer)

   return next();

}
//create a account route
app.post('/account', (request, response) => {

   const { cpf, name } = request.body;

   const isAlreadyCreated = customers.some((customer) => customer.cpf === cpf);

   if (isAlreadyCreated) {
      return response.status(400).send("account already exists!");
   }

   customers.push({
      id: uuidv4(),
      name,
      cpf,
      statement: []
   });

   console.log("account:", customers);
   return response.status(201).send("account created sucessfully!");

});

//show statement 
app.get("/statement", verifyIfExisteCPF, (request, resposne)=>{
const { customer } = request;

   return resposne.json(customer.statement);
})

//deposit
app.post("/deposit", verifyIfExisteCPF, (request, response)=>{
const { description, amount} = request.body;
const {customer} = request;

const statementOperation ={
   description,
   amount,
   created_at: new Date(),
   type: "deposit"
};

customer.statement.push(statementOperation);

return response.status(201).send();

})

//PORTA
app.listen(3333, () => {
   console.log('server started XD');
});