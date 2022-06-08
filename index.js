const express = require('express');
const fs = require('fs')


class Contendor {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo
    }

    async save(producto) {
        //Numbre - Recibe un objeto y lo guarda en el archivo, devuelve idAsignado
        try {
            let arrayObjetc = []
            if (fs.existsSync(this.nombreArchivo)) {
                let id = 1;
                const allData = Array.from(JSON.parse(await fs.promises.readFile(this.nombreArchivo, 'utf-8')))
                if(allData.length == 0){
                    producto.id = 1
                }
                else{
                     id = allData[allData.length - 1].id + 1;
                }
                producto.id = id;
                allData.push(producto);
                await fs.promises.writeFile(
                    this.nombreArchivo,
                    JSON.stringify(allData)
                    );  
                console.log(`Se creo el producto con el id ${producto.id}`)
            } else {
                producto.id = 1;
                arrayObjetc.push(producto);
                await fs.promises.writeFile(
                    this.nombreArchivo,
                    JSON.stringify(arrayObjetc)
                )
                return console.log(`Se creo el producto con el id ${producto.id}`)
            }

        } catch (e) {
            console.log(e);
        }
    }

    async getAll() {
        try {
            let data = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
            //console.log(JSON.parse(data));
            return JSON.parse(data)
        } catch (e) {
            console.log(e);
        }
    }

    async getById(id) {
        //Objetct[]- Devuelve un array con los objetos presentes en el id o null si no esta
        try {
            let data = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
            const paresado = JSON.parse(data)
            const result = paresado.find(element => element.id === id);
            console.log(result);
            return JSON.stringify(result);

        } catch (e) {
            console.log(e)
        }
    }

    async deleteById(id) {
        //void - Elimina del archivo el objeto con id buscado
        try{
            let data = JSON.parse(await fs.promises.readFile(this.nombreArchivo, 'utf-8'))
            let resultado = data.filter(objeto => objeto.id !== id);

            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(resultado))
            console.log(`Objeto con el id ${id} fue borrado`)
        }catch(e){
            console.log(e, "Erorr al borrar por id")
        }

    }

    async deleteAll() {
        //Elimina todos los objetos presentes en el archivo.
        try{
          await fs.promises.writeFile(this.nombreArchivo, "[]")
          console.log("Se borraron los elementos ")
        }catch(e){
            console.log(e, "Error al borrar todos los elementos")
        }
    }

}

const save = async () => {
    await nuevoArchivo.save({
      title: "pelota de futbol",
      price: "150",
      thumbnail: "pelota.png",
    });
    await nuevoArchivo.save({
      title: "videojuego",
      price: "600",
      thumbnail: "videojuego.png",
    });
    await nuevoArchivo.save({
      title: "monitor",
      price: "6000",
      thumbnail: "monitor.png",
    });
    await nuevoArchivo.save({
      title: "teclado",
      price: "150",
      thumbnail: "teclado.png",
    });
  }

const nuevoArchivo = new Contendor("./productos.json")

//para crear el archivo JSON
//save();
 
let puerto = 8080
const app = express();

const elements =  async () => {
    const data = await nuevoArchivo.getAll()
    return data;
}
const leerProductoRandom = async () => {
    const products = await nuevoArchivo.getAll();
    const data = products[Math.floor(Math.random() * products.length)];
   return data;
};

app.listen(puerto, () => {
    console.log(`escuchando en el puerto ${puerto}`)
})


app.get("/productos", (req, res) => {
    //TRAER OBJETOS 
    const product = async () => {
        const data = await elements();
        res.send(data);
    }
    product();
    

})

app.get('/productosRandom', (req, res, next)=>{
    //Devolver un producto random
    const product = async () => {
        const data = await leerProductoRandom();
        res.json(data);
    };
    product();
    
});

