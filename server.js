//hacer el import de express tradicional
//const express = require('express');

//el nuevo import se debe agregar en el package.json "type":"module"
import Express from "express";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const stringConexion = process.env.DATABASE_URL;

const client = new MongoClient(stringConexion, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let conexion;

const app = Express();
app.use(Express.json());

app.get("/vehiculos", (req, res) => {
  console.log("alguien hizo get en la ruta /vehiculos");
  conexion
    .collection("vehiculo")
    .find({})
    .toArray((err, result) => {
      if (err) {
        res.status(500).send("Error consultando los vehiculos");
      } else {
        res.json(result); //al front
        console.log(result); //a la terminal
      }
    });
});

app.post("/vehiculos/nuevo", (req, res) => {
  const datosVehiculo = req.body;
  console.log("llaves: ", Object.keys(datosVehiculo));
  try {
    if (
      Object.keys(datosVehiculo).includes("nombre") &&
      Object.keys(datosVehiculo).includes("marca") &&
      Object.keys(datosVehiculo).includes("modelo")
    ) {
      //implementar codigo para crear vinculo en la BD
      conexion
        .collection("vehiculo")
        .insertOne(datosVehiculo, (err, result) => {
          if (err) {
            console.error(err);
            res.sendStatus(500);
          } else {
            console.log(result);
            res.sendStatus(200);
          }
        });
    } else {
      res.sendStatus(500);
    }
  } catch {
    res.sendStatus(500);
  }
});

app.patch("/vehiculos/editar", (req, res) => {
  console.log("alguien esta haciendo un patch");
  const edicion = req.body;
  console.log(edicion); 
  const filtroVehiculo = { _id: new ObjectId(edicion.id) };
  delete edicion.id;
  const operacion = {
    $set: edicion,
  };
  conexion
    .collection("vehiculo")
    .findOneAndUpdate(  
      filtroVehiculo,
      operacion,
      { upsert: true, returnOriginal: true },
      (err, result) => {
        if (err) {
          console.error("error actualizando el vehiculo: ",err);
          res.sendStatus(500);
        } else{
          console.log("actualizado con exito");
          res.sendStatus(200);
        }
      }
    );
});

app.delete("/vehiculos/eliminar",(req,res) =>{
  const filtroVehiculo = { _id: new ObjectId(req.body.id) };
  conexion.collection('vehiculo').deleteOne(filtroVehiculo, (err,result) =>{
    if (err){
      console.error(err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});


const main = () => {
  client.connect((err, db) => {
    if (err) {
      console.error("Error conectando a la base de datos");
    }
    conexion = db.db("concesionario");
    console.log("conexion exitosa");

    return app.listen(process.env.PORT, () => {
      console.log(`Escuchando el puerto :${process.env.PORT}`);
    });
  });
};

main();
