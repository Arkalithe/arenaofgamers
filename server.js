const http = require('http');
const fs = require('fs');
const path = require('path');
const socketIo = require('socket.io');
const { Sequelize, DataTypes, Op  } = require('sequelize');
const validator = require('validator');

const sequelize = new Sequelize('arenagamers', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const Town = sequelize.define('town', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true //  créeer automatiquement des attributs createdAt et updatedAT
});
const Inscription = sequelize.define('inscription', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    prenom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birthDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    numberIn: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    townId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'towns',
            key: 'id'
        }

    },
}, {
    timestamps: true
});


const Event = sequelize.define('event', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false},
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});




sequelize.sync().then(() => {
    console.log('Base de données synchronisée');
});

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

    let extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err404, content404) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content404, 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const getUpcomingEvents = async () => {
    return await Event.findAll({
        where: {
            date: {
                [Sequelize.Op.gt]: new Date()
            }
        },
        include: [{
            model: Image,
            where: {
                imageId: Sequelize.col('image.id')
            }
        }]
    });
};

const getPastEvents = async () => {
    return await Event.findAll({
        where: {
            date: {
                [Sequelize.Op.lt]: new Date()
            }
        }
    });
};
const io = socketIo(server);

io.on('connection', (socket) => {

    socket.on('getUpcomingEvents', async () => {
        const events = await getUpcomingEvents();
        socket.emit('upcomingEvents', events);
    });

    socket.on('getPastEvents', async () => {
        const events = await getPastEvents();
        socket.emit('pastEvents', events);
    });

    socket.on('inscriptionCreate',async (data) => {
        const errors = [];

        if (!validator.isAlpha(data.prenom) || data.prenom.length < 2) {
            errors.push("Le prénom est invalide.");
        }
        if (!validator.isAlpha(data.nom) || data.nom.length < 2) {
            errors.push("Le nom est invalide.");
        }
        if (!validator.isEmail(data.email)) {
            errors.push("L'email est invalide.");
        }
        if (!validator.isDate(data.birthdate) && validator.isBefore(Date.now().toString())) {
            errors.push("La date de naissance est invalide.");
        }
        if (!validator.isInt(data.quantity, { min: 0, max: 99 })) {
            errors.push("Le nombre de participations est invalide.");
        }
        if (!validator.isInt(data.location)) {
            errors.push("La ville sélectionnée est invalide.");
        } else {

            const town = await Town.findByPk(data.location);
            if (!town) {
                errors.push("La ville sélectionnée n'existe pas.");
            }
        }
        if (errors.length > 0) {
            socket.emit('validationError', { errors });
        } else {

            Inscription.create({
                prenom: data.prenom,
                nom: data.nom,
                email: data.email,
                birthDate: data.birthdate,
                numberIn: data.quantity,
                townId: data.location
            }).then(() => {
                io.emit('launchCreate', data);
            }).catch(err => console.error(err));
        }
    });

});

server.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});
