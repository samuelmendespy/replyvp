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

<script setup>
import ticketService from "@/services/TicketService";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const toast = useToast();
const router = useRouter();

const messageList = ref([
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
]);

const user = ref(
  JSON.parse(localStorage.getItem("user")) || {
    id: 0,
    roles: "guest",
    username: "Guest",
  }
);

const newMessage = ref(router.query.message || "");
const subject = ref(router.query.subject || "Assunto indefinido");

const ticketId = ref(router.query.ref || 0);
const isTicketOpen = ref(false);

onMounted(checkTicket());

const getMessages = async () => {
  // TODO: Use Auth Bearer with token to send user id
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) {
    toast.error("Falha na autenticação!", { timeout: 3000 });
    // Redirect user
  }
  try {
    const response = await ticketService.getTicketMessages(ticketId, user.id);
    loadMessagesData(response);
  } catch (error) {
    toast.error("Ocorreu um erro ao carregar mensagens do ticket!", {
      timeout: 3000,
    });
  }
};

const loadMessagesData = (data = []) => {
  data.forEach((item) => {
    const newItem = {
      message_id: item.message_id,
      text: item.text,
      sender: item.sender,
      timestamp: item.created_at,
    };
    messageList.value.push(newItem);
  });
  toast.info("Carregando mensagens", {
    timeout: 3000,
  });
};

const loadFreshMessage = (freshMessage) => {
  try {
    messageList.push(freshMessage);
  } catch (err) {
    console.log(err);
    toast.error("Ocorreu um erro ao conectar com o servidor!", {
      timeout: 3000,
    });
  }
};
// TODO: Call sendMessage
const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    messageList.value.push({
      message_id: 0,
      text: newMessage.value,
      sender: "user",
      timestamp: new Date(),
    });
    newMessage.value = "";
    setTimeout(fakeReply, 1000);
  }
};

const addNewUserMessage = async () => {
  try {
    const response = await ticketService.addNewMessage(
      ticketId.value,
      user.value.id,
      newMessage.value
    );

    loadFreshMessage(response);

    newMessage.value = "";
    setTimeout(fakeReply, 1000);
  } catch (err) {
    console.log(err);
    toast.error("Ocorreu um erro ao conectar com o servidor!", {
      timeout: 3000,
    });
  }
};

const fakeReply = () => {
  messageList.value.push({
    text: "Estamos verificando sua solicitação.",
    sender: "support",
    timestamp: new Date(),
  });
};
const createNewTicket = async () => {
  try {
    const createdTicketId = await ticketService.createTicket(
      user.value.id,
      subject.value,
      newMessage.value
    );
    redirectToCreatedTicket(createdTicketId);
  } catch (err) {
    console.log(err);
    toast.error("Ocorreu um erro ao conectar com o servidor!", {
      timeout: 3000,
    });
  }
};

const submitNewMessage = () => {
  if (newMessage.value === "") {
    toast.error("Erro: mensagem em branco!", {
      timeout: 3000,
    });
    return;
  }

  if (isTicketOpen.value) {
    addNewUserMessage();
  } else {
    // TODO: Redirect to New Ticket Page
    createNewTicket();
  }
};

const redirectToCreatedTicket = (newTicketId) => {
  console.log("Current Ticket is ID: ", newTicketId);

  router.push({
    name: "MessagesPage",
    query: {
      ref: newTicketId,
    },
  });
};

const formatTime = (date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const checkTicket = () => {
  if (ticketId.value != 0) {
    toast.info(`Ticket REF#${ticketId.value}`, { timeout: 3000 });
    isTicketOpen.value = true;
    getMessages();
  } else {
    // TODO: Redirect to New Ticket Page
    toast.info(`Envie sua mensagem para abrir um novo ticket`, {
      timeout: 4000,
    });
  }
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
