const http = require('http');
const fs = require('fs');
const path = require('path');
const socketIo = require('socket.io');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('arenagamer', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const inscription = sequelize.define('inscription', {
    id: {
        type: DataTypes.number,
        allowNull: false,
        autoIncrement: true
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
        type: DataTypes.NUMBER,
        allowNull: false
    },
    townId: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
}, {
    timestamps: true
});
const town = sequelize.define('town', {
    id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        autoIncrement: true
    },
    nom: {
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
