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
        @keyup.enter="submitNewMessage"
        placeholder="Digite sua mensagem..."
      />
      <button @click="submitNewMessage">Enviar</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  name: "MessagesPage",
  data() {
    return {
      messages: [
        {
          message_id: 0,
          text: "Olá! Como posso ajudar?",
          sender: "support",
          timestamp: new Date(),
        },
        {
          message_id: 1,
          text: "Oi! Preciso de suporte.",
          sender: "user",
          timestamp: new Date(),
        },
      ],
      user: JSON.parse(localStorage.getItem("user")) || {
        id: 0,
        roles: "guest",
        username: "Guest",
      },
      newMessage: this.$route.query.message || "Sem mensagem",
      subject: this.$route.query.subject || "Assunto indefinido",
      ticketId: this.$route.query.ref || 0,
      isTicketOpen: false,
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    loadFreshMessage(freshMessage) {
      console.log(freshMessage);
      console.log(this.messages[0]);

      try {
        this.messages.push(freshMessage);
      } catch (err) {
        console.log(err);
        this.toast.error("Ocorreu um erro ao conectar com o servidor!", {
          timeout: 3000,
        });
      }
    },
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.messages.push({
          message_id: 0,
          text: this.newMessage,
          sender: "user",
          timestamp: new Date(),
        });
        this.newMessage = "";
        setTimeout(this.fakeReply, 1000);
      }
    },
    async addNewUserMessage() {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/tickets/new_message.php",
          {
            ticket_id: this.ticketId,
            user_id: this.user.id,
            message: this.newMessage,
          }
        );

        if (response.status === 201) {
          const lastUserMessage = response.data.added;
          const compact = {
            message_id: lastUserMessage.message_id,
            text: lastUserMessage.text,
            sender: "user",
            timestamp: lastUserMessage.compact,
          };

          this.loadFreshMessage(compact);
        }

        this.newMessage = "";
        setTimeout(this.fakeReply, 1000);
      } catch (err) {
        this.toast.error("Ocorreu um erro ao conectar com o servidor!", {
          timeout: 3000,
        });
      }
    },
    fakeReply() {
      this.messages.push({
        text: "Estamos verificando sua solicitação.",
        sender: "support",
        timestamp: new Date(),
      });
    },
    submitNewMessage() {
      if (this.isTicketOpen) {
        // this.sendMessage();
        this.addNewUserMessage();
      } else {
        this.registerNewTicket();
      }
    },
    async registerNewTicket() {
      const response = await axios.post("http://localhost:8080/api/tickets/create.php", {
        user_id: this.user.id,
        subject: this.subject,
        message: this.newMessage,
      });

      if (response.status === 201) {
        const createdTicketId = response.data.ticket_id;
        this.isTicketOpen = true;

        this.toast.success(`O código do seu ticket é REF ${createdTicketId}`, {
          timeout: 3000,
        });

        this.redirectToCreatedTicket(createdTicketId);
      } else {
        const errorData = await response.json();
        this.error = errorData.error || "Erro ao tentar enviar mensagem.";
      }
    },
    redirectToCreatedTicket(newTicketId) {
      console.log("Current Ticket is ID: ", newTicketId);

      this.$router.push({
        name: "MessagesPage",
        query: {
          ref: newTicketId,
        },
      });
    },
    formatTime(date) {
      return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    },
    checkTicket() {
      if (this.ticketId != 0) {
        this.toast.info(`Carregando Ticket REF ${this.ticketId}`, { timeout: 3000 });
        this.isTicketOpen = true;
      } else {
        this.toast.info(`Envie sua mensagem para abrir o ticket`, { timeout: 4000 });
      }
    },
  },
  mounted() {
    this.checkTicket();
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
