let socket = io();
let messages = document.getElementById('messages');
let form = document.getElementById('form');
let inputMessage = document.getElementById('message');
let inputUsername = document.getElementById('username');
let messageHistory = JSON.parse(localStorage.getItem('messageHistory')) || [];

// Mostrar mensajes almacenados al cargar la página
messageHistory.forEach(function (msg) {
  let item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (inputMessage.value && inputUsername.value) {
    // Enviar mensaje y nombre de usuario al servidor a través del socket
    socket.emit('chat message', {
      username: inputUsername.value,
      message: inputMessage.value
    });

    inputMessage.value = '';
  }
});

// Escucha los mensajes del servidor
socket.on('chat message', function (data) {
  let item = document.createElement('li');
  item.textContent = `${data.username}: ${data.message}`;
  messages.appendChild(item);

  // Almacena los mensajes
  messageHistory.push(`${data.username}: ${data.message}`);
  localStorage.setItem('messageHistory', JSON.stringify(messageHistory));

  window.scrollTo(0, document.body.scrollHeight);
});


let typingTimer; 
const doneTypingInterval = 1000;

// captura el evento cuando el usuario comienza a escribir
inputMessage.addEventListener('input', function () {
  socket.emit('typing', inputUsername.value);

  // Es el temporizador
  clearTimeout(typingTimer);
  typingTimer = setTimeout(function () {
    socket.emit('stop typing', inputUsername.value);
  }, doneTypingInterval);
});

// Escuchar evento 'user typing' cuando el usuario escribe
socket.on('user typing', function (username) {
  let typingIndicator = document.getElementById('typing-indicator');
  typingIndicator.textContent = `${username} está escribiendo...`;
});

// Escuchar evento 'user stop typing' cuando el usuario no escribe
socket.on('user stop typing', function (username) {
  let typingIndicator = document.getElementById('typing-indicator');
  typingIndicator.textContent = '';
});




