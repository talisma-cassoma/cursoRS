
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

const customers = [];

//middleware
app.use(express.json());

//verify 
function verifyIfExisteCPF(request, response, next) {

   const { cpf } = request.headers;
   const customer = customers.find((customer) => customer.cpf === cpf);

   if (!customer) {
      return response.status(400).send("account not found!")
   }

   request.customer = customer
   //console.log(request.customer)

   return next();

}

function getBalance(statement) {

   const balance = statement.reduce((acc, operation) => {
      if (operation.type == "credit") {
         return acc + operation.amount;
      }
      else if (operation.type == "debit") {
         return acc - operation.amount;
      }
   }, 0);

   return balance;
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
app.get("/statement", verifyIfExisteCPF, (request, resposne) => {
   const { customer } = request;

   return resposne.json(customer.statement);
})

//deposit
app.post("/deposit", verifyIfExisteCPF, (request, response) => {
   const { description, amount } = request.body;
   const { customer } = request;

   const statementOperation = {
      description,
      amount,
      created_at: new Date(),
      type: "credit"
   };

   customer.statement.push(statementOperation);

   return response.status(201).send();

})

//saque
app.post("/withdraw", verifyIfExisteCPF, (request, response) => {

   const { description, amount } = request.body;
   const { customer } = request;

   const statementOperation = {
      description,
      amount,
      created_at: new Date(),
      type: "debit"
   };

   const balance = getBalance(customer.statement);
   //console.log(`saldo: ${balance} €`);

   if (balance < amount) { return response.status(401).send(); }

   customer.statement.push(statementOperation);

   return response.status(201).send()
})

//show statement 
app.get("/statement/date", verifyIfExisteCPF, (request, resposne) => {
   const { customer } = request;
   const { date } = request.query

   const dateFormat = new Date(date + " 00:00")

   const statement = customer.statement.filter(
      (operation) => 
         operation.created_at.toDateString() === 
         new Date(dateFormat).toDateString()
   )

   return resposne.json(statement)
})

//UPAGRADE ACC INFOS
app.put("/account", verifyIfExisteCPF, (request, response)=>{

   const { customer} = request;
   const { name } = request.body;
   
   customer.name = name;

   return response.status(201).send();
})

//get account info
app.get("/account", verifyIfExisteCPF, (request, response)=>{
   const {customer}= request;

   return response.json(customer);
})

//PORTA
app.listen(3333, () => {
   console.log('server started XD');
});