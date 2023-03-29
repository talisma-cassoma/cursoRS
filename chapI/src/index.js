
const express = require('express');

const app = express();


// - get   => pegar as info
app.get("/courses", (request, response)=>{
 return response.json({message: 'oi'})
})

// - post  => criar registro
app.post("/courses", (request, response)=>{
    console.log(request.body)
   return response.json(["oi post"])
   })
// - put   => modificar/actualizar
app.put("/courses/:id", (request, response)=>{
    return response.json(["oi put"])
   
   })
// - delete => apagar
app.delete("/courses/:id", (request, response)=>{
   return response.json(["oi delete"])
   })
// - push  => actualizar algo especifico
app.patch("/courses/:id", (request, response)=>{
   return response.json(["oi patch"])
   })

//PORTA
app.listen(3333, ()=>{
    console.log('server started XD')
});