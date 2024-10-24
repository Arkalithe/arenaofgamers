const http = require('http');
const fs = require('fs');
const path = require('path');
const socketIo = require('socket.io');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('arenagamers', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const inscription = sequelize.define('inscription', {
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
            model: 'town',
            key: 'id'
        }

    },
}, {
    timestamps: true
});
const town = sequelize.define('town', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

const event = sequelize.define('event', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    imageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'images',
            key: 'id'
        }
    }
}, {
    timestamps: true
});
const image = sequelize.define('image', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});



inscription.hasOne(town, { foreignKey: 'id' });

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
            res.writeHead(500);
            res.end(`Server Error: ${err.code}`);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');

    Message.findAll().then(messages => {
        messages.forEach(message => {
            socket.emit('chatMessage', message);
        });
    });

    socket.on('newMessage', (data) => {
        Message.create(data).then(() => {
            io.emit('chatMessage', data);
        });
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});

server.listen(3000, () => {
    console.log('Serveur démarré sur le port 3000');
});
