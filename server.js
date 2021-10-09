//hacer el import de express tradicional
//const express = require('express');

//el nuevo import se debe agregar en el package.json "type":"module"
import Express from 'express';

const app = Express();
app.use(Express.json());


app.get('/vehiculos',(req,res) => {
  console.log("alguien hizo get en la ruta /vehiculos");
  const vehiculos = [
    {nombre:"corolla", marca:"toyota", modelo:"2012"},
    {nombre:"mazda3", marca:"mazda", modelo:"2011"},
    {nombre:"sandero", marca:"renault", modelo:"2010"},
  ];
  res.send(vehiculos);
});

app.post('/vehiculos/nuevo',(req,res) => {
  const datosVehiculo = req.body;
  console.log("llaves: ",Object.keys(datosVehiculo));
  try{
    if (
      Object.keys(datosVehiculo).includes('nombre') &&
      Object.keys(datosVehiculo).includes('marca') &&
      Object.keys(datosVehiculo).includes('modelo')
    ){
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } catch{
    res.sendStatus(500);
  }
  
});


app.listen(5000,()=>{
  console.log("Escuchando el puerto 5000")
});
