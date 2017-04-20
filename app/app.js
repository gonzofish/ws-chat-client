'use strict';

(function() {
    const socket = new WebSocket('ws://localhost:4567');
    let username = null;

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type === 'logged_in') {
            username = message.username;
        } else if (message.type === 'login_failure') {
            getUsername(message.username);
        } else if (message.type === 'chat') {
            addChatMessage(message);
        }
    };

    function addChatMessage(message) {
        const messages = document.querySelector('.messages');
        const messageRow = document.createElement('div');
        const messageUser = document.createElement('div');
        const messageBlock = document.createElement('div');

        const messageText = document.createTextNode(message.value);
        const userText = document.createTextNode(message.username);

        messageRow.classList.add('message-row');
        messageUser.classList.add('username');
        messageBlock.classList.add('message');

        if (message.username === username) {
            messageUser.classList.add('current-user');
        }

        messageUser.appendChild(userText);
        messageBlock.appendChild(messageText);

        messageRow.appendChild(messageUser);
        messageRow.appendChild(messageBlock);

        messages.appendChild(messageRow);
    }

    socket.onopen = () => getUsername();

    function getUsername(takenUsername) {
        const extra = takenUsername ? `\n\nThe username "${ takenUsername } is taken!` : ''
        const username = window.prompt(`Please enter username${extra}:`);

        sendSocketMessage({
            type: 'login',
            username: username
        });
    }

    window.sendMessage = (message) => {
        sendSocketMessage({
            type: 'chat',
            username: username,
            value: message.value
        });
        message.value = '';

        return false;
    };

    const sendSocketMessage = (message) => socket.send(JSON.stringify(message));
})();
