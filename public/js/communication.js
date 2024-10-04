/*
sendToServer()

Sends a message from the client to the server, web socket protocol.
The message comes from the send-message field.
Params:
    socket - web socket object
*/
// deno-lint-ignore no-unused-vars
function sendToServer(socket) {
  const sendField = document.getElementById("send-message");
  socket.send(JSON.stringify({ message: sendField.value }));
}
