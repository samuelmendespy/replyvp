<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="card-title text-center mb-4">Gerar Novo Ticket</h2>
            <form @submit.prevent="generateTicket()">
              <div class="mb-3">
                <label for="ticket-subject" class="form-label">Assunto do Ticket</label>
                <input
                  type="text"
                  id="ticket-subject"
                  class="form-control"
                  v-model="ticketSubject"
                  placeholder="Digite o assunto do Ticket"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="message-content" class="form-label"
                  >Conteúdo da Mensagem</label
                >
                <input
                  type="text"
                  id="message-content"
                  class="form-control"
                  v-model="messageContent"
                  placeholder="Digite o código da mensagem"
                  required
                />
              </div>
              <div v-if="error" class="alert alert-danger mt-2" role="alert">
                {{ error }}
              </div>
              <div class="d-grid gap-2 mb-3">
                <button type="submit" class="btn btn-secondary">Gerar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const ticketSubject = ref("");
const messageContent = ref("");
const error = ref(null);

const generateTicket = () => {
  router.push({
    name: "MessagesPage",
    query: {
      subject: ticketSubject.value,
      message: messageContent.value,
    },
  });
};
</script>
