import {createServer} from 'node:http';
import express from 'express';
import { Server } from 'socket.io';


const app = express(); // <-- Création d'une application Express
const server = createServer(app); // <-- Utilisation de l'application Express
const io = new Server(server);


// Configuration de l'application Express
app.use(express.static('public')); // <-- Serveur de fichiers statiques


app.get('/', (req, res) => {
	res.redirect('/index.html'); // <-- Redirection vers la page d'accueil
});

server.listen(3000, () => { // <-- Démarrage du serveur
	console.log('Server is running on port 3000');
});
// Exemple de serveur Express avec un serveur HTTP
 const typinguser = new Set()
io.on('connection', (socket) => {
	console.log('Client connected');

    socket.on("user_message_send", (data) => {
        console.log(data.content)
        io.emit("user_message", {
            content: data.content,
            author: socket.id,
            time: new Date().toLocaleTimeString(),
            isMe: false
        })
    })
    io.emit("system_message", {
        content:`welcome to ${socket.id}`
    })
    socket.on("disconnect",() => {
        typinguser.delete(socket.id)

        io.emit("system_message", {
            content:`bye to ${socket.id}`
        })
    })
    
	socket.on('message', (data) => {
		console.log('Message from client:', data);
		socket.emit('message', 'Hello from server');
	});
   socket.on("typing_start", () => {
        typinguser.add(socket.id)
        io.emit("typing", Array.from(typinguser))
    })
    socket.on("typing_stop", () => {
        typinguser.delete(socket.id)
        io.emit("typing", Array.from(typinguser))
    })
});
