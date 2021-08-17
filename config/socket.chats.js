const db = require("../models/api_models");
const Dirver_lat_long = db.driver_lat_long;
const Chat = db.chat;
var admin = require("../config/fcm_init").isFcm;
const formatMessage = require('./utils/messages');
const formatLatLong = require('./utils/lat_long');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    get_lat_long_room
} = require('./utils/users');


exports.socket_io = function (io) {
    console.log("outside io");

    const AppName = 'Daala App';

    // Run when client connects
    io.on('connection', socket => {

        socket.on('connect_chat', ({ username, room }) => {
            console.log("connect_chat Socket ID: " + socket.id);

            const user = userJoin(socket.id, username, room);
            socket.join(user.room);
            console.log(user);

            // Welcome current user
            socket.emit('connect_chat', formatMessage('Welcome to ' + AppName));

            // Broadcast when a user connects
            socket.broadcast
                .to(user.room)
                .emit(
                    'connect_chat',
                    formatMessage('' + `${user.username} has joined the chat`)
                );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        });

        //on typing 
        socket.on('on_typing', function (typing) {
            console.log("Typing.... ");
            io.emit('on_typing', typing);
        });

        //on connect user   
        socket.on('connect_driver_lat_long_room', ({ room, driver_id, lat, long, rotation }) => {
            console.log('connect room driver lat long : ' + room, driver_id, lat, long, rotation);
            const user = get_lat_long_room(socket.id, room, driver_id, lat, long, rotation);
            socket.join(user.room);
            console.log(user);

            io.to(user.room).emit('connect_driver_lat_long_room', formatLatLong(room, driver_id, lat, long, rotation));
            console.log(formatLatLong(room, driver_id, lat, long, rotation))

            Dirver_lat_long.update({
                latitude: user.lat,
                longitude: user.long,
                status: 'unavailable'

            },
                {
                    where: { driver_id: user.driver_id },
                    returning: true,
                    plain: true
                }).then(update_lat_long => {

                    console.log('connect driver room  current location is updated successfuly');

                }).catch(err => {

                    console.log('connect driver room  current location is not updated! :' + err);

                });


        });

        // Listen for chatMessage
        socket.on('send_message', (message, fcm_token, mobile_no) => {

            console.log("send_message Socket ID: " + socket.id);
            const user = getCurrentUser(socket.id);
            console.log("this is user id :    " + socket.id);
            console.log("this is user room :    " + user.room)
            io.to(user.room).emit('send_message', formatMessage(user.username, message));
            console.log(formatMessage(user.username, message));
            const user_format = formatMessage(user.username, message);
            var payload = {
               
                data:{
                    title: user_format.text.username,
                    body: user_format.text.message
                }
            };

            var options = {
                priority: "high",
                timeToLive: 60 * 60 * 24
            };

            Chat.create({
                mobile_no: user_format.text.mobile_no,
                username: user_format.text.username,
                message: user_format.text.message,
                time: user_format.time,
                trip_id: user_format.text.room
            }).then(chating => {

                admin.messaging().sendToDevice(try_to_parse(user_format.text.fcm_token), payload, options)
                    .then(function (response) {
                        console.log("Successfully fcm sent message chat:", response);
                        console.log('chat is saved ');
                    })
                    .catch(function (error) {
                        console.log("Error sending fcm message in chat:", error);
                    });

            }).catch(err => {
                console.log('chat is not saved :' + err);


            });



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


function try_to_parse(token) {
    try {
        return JSON.parse(token);
    } catch (e) {
        return token;
    }
}