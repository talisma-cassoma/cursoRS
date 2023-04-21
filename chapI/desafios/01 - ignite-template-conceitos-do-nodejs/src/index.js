const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username }  = request.headers;
  
  const user = users.find( user => user.username === username );

  if(!user){
     return response.status(401).send();
  }
 
  request.user = user;
  return next();
}

app.post('/users', (request, response) => {
  
  const { name, username } = request.body;
  const isUser = users.some( user => user.username === username );
  
  if(isUser){
    return response.json({"error": "this username already exist!"});
  }
  
  const user = 
  {
    id: uuidv4(),
    name,
    username,
    todo: []
  }

  users.push(user);

  return response.json(users);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  
  const { user } = request;
  
  return response.json(user);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  
  const {  user } = request;
  const { title, deadline } = request.body;
  
  user.todo.push(
    {
      uid: uuidv4(),
      title,
      deadline: new Date(deadline), 
      done: false, 
      created_at: new Date() 
    })

    return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;