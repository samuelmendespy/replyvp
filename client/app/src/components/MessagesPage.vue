<template>
  <div class="chat-container">
    <div class="chat-box">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message"
        :class="msg.sender === 'user' ? 'user-message' : 'support-message'"
      >
        <p>{{ msg.text }}</p>
        <small>{{ formatTime(msg.timestamp) }}</small>
      </div>
    </div>
    <div class="chat-input">
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Digite sua mensagem..."
      />
      <button @click="sendMessage">Enviar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessagesPage",
  data() {
    return {
      messages: [
        { text: "Olá! Como posso ajudar?", sender: "support", timestamp: new Date() },
        { text: "Oi! Preciso de suporte.", sender: "user", timestamp: new Date() },
      ],
      newMessage: this.$route.query.message || "Sem mensagem",
      subject: this.$route.query.subject || "Assunto indefinido",
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.messages.push({
          text: this.newMessage,
          sender: "user",
          timestamp: new Date(),
        });
        this.newMessage = "";
        setTimeout(this.fakeReply, 1000);
      }
    },
    fakeReply() {
      this.messages.push({
        text: "Estamos verificando sua solicitação.",
        sender: "support",
        timestamp: new Date(),
      });
    },
    openTicket(newTicketId) {
      // Redirect to new ticket
      console.log("Current Ticket is ID: ", newTicketId);
    },
    formatTime(date) {
      return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    },
  },
};
</script>

<style scoped>
.chat-container {
  width: 400px;
  max-width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: #f9f9f9;
}

.chat-box {
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;
}

.message {
  padding: 8px 12px;
  border-radius: 10px;
  margin: 5px 0;
  max-width: 70%;
}

.user-message {
  background: #dcf8c6;
  align-self: flex-end;
  text-align: right;
}

.support-message {
  background: #fff;
  align-self: flex-start;
  text-align: left;
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
}

.chat-input input {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.chat-input button {
  margin-left: 10px;
  padding: 8px 15px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
</style>
