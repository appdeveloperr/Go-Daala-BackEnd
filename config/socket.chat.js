
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');


console.log("outside io");
const AppName = 'Go Daala App';
exports.socket_io =function(io){
    // Run when client connects
    io.on('connection', socket => {
        socket.on('connect_user', ({ username, room }) => {
            const user = userJoin(socket.id, username, room);

            socket.join(user.room);
            console.log(user);

            // Welcome current user
            socket.emit('connect_user', formatMessage('Welcome to ', AppName));

            // Broadcast when a user connects
            socket.broadcast
                .to(user.room)
                .emit(
                    'connect_user',
                    formatMessage(AppName, `${user.username} has joined the chat`)
                );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        });


        socket.on('on_typing', function (typing) {
            console.log("Typing.... ");
            io.emit('on_typing', typing);
        });

        // Listen for chatMessage
        socket.on('send_message', msg => {

            const user = getCurrentUser(socket.id);
            console.log("this is user id :    " + socket.id);
            console.log("this is user room :    " + user.room)
            io.to(user.room).emit('send_message', formatMessage(user.username, msg));
            console.log(formatMessage(user.username, msg));

        });

        // Runs when client disconnects
        socket.on('disconnect', () => {
            const user = userLeave(socket.id);

            if (user) {
                io.to(user.room).emit(
                    'disconnect',
                    formatMessage(AppName, `${user.username} has left the chat`)
                );

                // Send users and room info
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });
            }
        });
    });
}
