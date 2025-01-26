<template>
  <div class="chat-container">
    <div class="chat-box">
      <div
        v-for="(msg, index) in messageList"
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
import ticketService from "@/services/ticketService";
import { useToast } from "vue-toastification";

export default {
  name: "MessagesPage",
  data() {
    return {
      messageList: [
        {
          message_id: 0,
          text: "Oi! Preciso de suporte.",
          sender: "user",
          timestamp: new Date(),
        },
        {
          message_id: 1,
          text: "Olá! Como posso ajudar?",
          sender: "support",
          timestamp: new Date(),
        },
      ],
      user: JSON.parse(localStorage.getItem("user")) || {
        id: 0,
        roles: "guest",
        username: "Guest",
      },
      newMessage: this.$route.query.message || "",
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
    async getMessages() {
      // TODO: Use Auth Bearer with token to send user id
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        this.toast.error("Falha na autenticação!", { timeout: 3000 });
        // Redirect user
      }
      try {
        const response = await ticketService.getTicketMessages(this.ticketId, user.id);
        this.loadMessagesData(response);
      } catch (error) {
        this.toast.error("Ocorreu um erro ao carregar mensagens do ticket!", {
          timeout: 3000,
        });
      }
    },
    loadMessagesData(data = []) {
      data.forEach((item) => {
        const newItem = {
          message_id: item.message_id,
          text: item.text,
          sender: item.sender,
          timestamp: item.created_at,
        };
        this.messageList.push(newItem);
      });
      this.toast.info("Carregando mensagens", {
        timeout: 3000,
      });
    },
    loadFreshMessage(freshMessage) {
      try {
        this.messageList.push(freshMessage);
      } catch (error) {
        console.log(error);
        this.toast.error("Ocorreu um erro ao conectar com o servidor!", {
          timeout: 3000,
        });
      }
    },
    sendMessage() {
      console.log(this.newMessage);
      if (this.newMessage.trim() !== "") {
        this.messageList.push({
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
        const response = await ticketService.addNewMessage(
          this.ticketId,
          this.user.id,
          this.newMessage
        );

        this.loadFreshMessage(response);

        this.newMessage = "";
        setTimeout(this.fakeReply, 1000);
      } catch (error) {
        console.log(error);
        this.toast.error("Ocorreu um erro ao conectar com o servidor!", {
          timeout: 3000,
        });
      }
    },
    fakeReply() {
      this.messageList.push({
        text: "Estamos verificando sua solicitação.",
        sender: "support",
        timestamp: new Date(),
      });
    },
    async createNewTicket() {
      try {
        const createdTicketId = await ticketService.createTicket(
          this.user.id,
          this.subject,
          this.newMessage
        );
        this.redirectToCreatedTicket(createdTicketId);
      } catch (error) {
        console.log(error);
        this.toast.error("Ocorreu um erro ao conectar com o servidor!", {
          timeout: 3000,
        });
      }
    },
    submitNewMessage() {
      if (this.newMessage === "") {
        this.toast.error("Erro: mensagem em branco!", {
          timeout: 3000,
        });
        return;
      }

      if (this.isTicketOpen) {
        this.addNewUserMessage();
      } else {
        this.createNewTicket();
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
        this.toast.info(`Ticket REF#${this.ticketId}`, { timeout: 3000 });
        this.isTicketOpen = true;
        this.getMessages();
      } else {
        this.toast.info(`Envie sua mensagem para abrir um novo ticket`, {
          timeout: 4000,
        });
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
  display: flex;
  flex-direction: column;
}

.message {
  padding: 8px 12px;
  border-radius: 10px;
  margin: 5px 0;
  max-width: 70%;
  display: inline-block;
  line-break: anywhere;
}

.user-message {
  background: #dcf8c6;
  align-self: flex-end;
  text-align: right;
  margin-left: auto;
}

.support-message {
  background: #fff;
  align-self: flex-start;
  text-align: left;
  margin-right: auto;
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
