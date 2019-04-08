module.exports = function(io) {
    io.on('connection', (socket) => {

        socket.on('join room', (room_name) => {
            socket.join(room_name);
        });

        socket.on('refresh', (room_name) => {
            socket.to(room_name).emit('refreshPage', {});
        });
    });
}