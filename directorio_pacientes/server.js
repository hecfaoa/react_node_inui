const express = require('express'); //Express es un framework de Node.js que se utiliza para crear aplicaciones web y APIs
const bodyParser = require('body-parser'); //middleware que analiza y procesa los datos de solicitudes HTTP
const fs = require('fs');//El módulo fs de Node.js permite interactuar con los archivos del sistema, como crear, escribir, renombrar, copiar, mover, y eliminar
const path = require('path'); //El módulo path de Node.js sirve para trabajar con rutas de archivos y directorios
const cors = require('cors'); // característica de seguridad que permite que los navegadores carguen recursos de otros dominios


const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

// Middleware para parsear JSON
app.use(bodyParser.json());


// Ruta para obtener todos los pacientes
app.get('/api/pacientes', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'pacientes.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo los datos');
        }
        res.send(JSON.parse(data));
    });
});

// Ruta para obtener un paciente
app.get('/api/pacientes/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(path.join(__dirname, 'data', 'pacientes.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo los datos');
        }
        
        let pacientes = JSON.parse(data);
        const index = pacientes.findIndex(p => p.id === id);
        if (index !== -1) {
            pacientes[index] = { ...pacientes[index] };
            res.send(pacientes[index]);
        } else {
            res.status(404).send('Paciente no encontrado');
        }
    });
});

// Ruta para obtener las observaciones de un paciente
app.get('/api/observaciones/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(path.join(__dirname, 'data', 'observacionesXpaciente.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo los datos');
        }

        let observaciones = JSON.parse(data);
        const resultado = observaciones
         .filter(observ => observ.id_paciente === id)
         .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
         if(Array.isArray(resultado) && resultado.length !== 0){
            res.send(resultado);
        }else{
            res.send(false);
        }
    });
});

// Ruta para agregar un nuevo paciente
app.post('/api/pacientes', (req, res) => {
    const newPaciente = req.body;

    fs.readFile(path.join(__dirname, 'data', 'pacientes.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo los datos');
        }
        
        const pacientes = JSON.parse(data);
        pacientes.push(newPaciente);

        fs.writeFile(path.join(__dirname, 'data', 'pacientes.json'), JSON.stringify(pacientes, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error escribiendo los datos');
            }
            res.status(201).send(newPaciente);
        });
    });
});

// Ruta para agregar una nueva observacion del paciente
app.post('/api/observaciones', (req, res) => {
    const newObservacion = req.body;

    fs.readFile(path.join(__dirname, 'data', 'observacionesXpaciente.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo los datos');
        }
        
        const observaciones = JSON.parse(data);
        observaciones.push(newObservacion);

        fs.writeFile(path.join(__dirname, 'data', 'observacionesXpaciente.json'), JSON.stringify(observaciones, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error escribiendo los datos');
            }
            res.status(201).send(newObservacion);
        });
    });
});

// Ruta para actualizar un paciente
app.put('/api/pacientes/:id', (req, res) => {
    const { id } = req.params;
    const updatedPaciente = req.body;

    fs.readFile(path.join(__dirname, 'data', 'pacientes.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo los datos');
        }
        
        let pacientes = JSON.parse(data);
        const index = pacientes.findIndex(p => p.id === id);

        if (index !== -1) {
            pacientes[index] = { ...pacientes[index], ...updatedPaciente };

            fs.writeFile(path.join(__dirname, 'data', 'pacientes.json'), JSON.stringify(pacientes, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error escribiendo los datos');
                }
                res.send(pacientes[index]);
            });
        } else {
            res.status(404).send('Paciente no encontrado');
        }
    });
});

// Ruta para eliminar una observacion del paciente
app.delete('/api/observaciones/:id', (req, res) => {
    const { id } = req.params;
    
    fs.readFile(path.join(__dirname, 'data', 'observacionesXpaciente.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error leyendo los datos');
        }

        let observaciones = JSON.parse(data);


        const index = observaciones.findIndex(p => p.id === id);

        if (index !== -1) {
            observaciones.splice(index, 1);;

            fs.writeFile(path.join(__dirname, 'data', 'observacionesXpaciente.json'), JSON.stringify(observaciones, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Error escribiendo los datos');
                }
                res.status(204).send('Observacion eliminada');
            });
        }
        else{
            return res.status(404).json({ message: 'Obervacion no encontrada' }); // Item no encontrado
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
