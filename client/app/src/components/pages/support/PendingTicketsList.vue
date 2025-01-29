<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">Tickets Abertos</h2>
    <table class="table table-striped table-bordered">
      <thead class="table-dark">
        <tr>
          <th>Reincidência</th>
          <th>Assunto</th>
          <th>Última mensagem</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(message, index) in ticketsList" :key="index">
          <td>{{ message.is_repeat ? "Reincidente" : "Primeiro" }}</td>
          <td>
            {{
              message.subject.slice(0, 20) + (message.subject.length > 20 ? "..." : "")
            }}
          </td>
          <td>{{ formatDate(message.timestamp) }}</td>
          <td>
            <button
              class="btn btn-warning btn-sm"
              @click="assistTicket(message.ticket_id)"
            >
              Dar Assistência
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="text-center mt-3">
      <button @click="$emit('back-to-contact')" class="btn btn-secondary">Voltar</button>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import supportService from "@/services/supportService";

export default {
  name: "PendingTicketsList",
  data() {
    return {
      supportUser: JSON.parse(localStorage.getItem("user")) || {
        id: 0,
        username: "Guest",
        roles: ["Guest"],
      },
      ticketsList: [
        {
          ticket_id: "AB0123",
          is_repeat: false,
          subject: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          timestamp: "2025-01-09 10:00:00",
        },
        {
          ticket_id: "AB0124",
          is_repeat: true,
          subject:
            "Vivamus id vulputate ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
          timestamp: "2025-01-09 12:00:00",
        },
        {
          ticket_id: "AB0124",
          is_repeat: false,
          subject:
            "Vestibulum eleifend aliquam lacus ut iaculis. Ut pharetra sapien nunc, ullamcorper vestibulum nisi vulputate in.",
          timestamp: "2025-01-09 14:00:00",
        },
      ],
    };
  },
  async created() {
    const toast = useToast();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        toast.error("Falha na autenticação!", { timeout: 3000 });
        // Redirect user
        this.redirectToLogin();
      } else {
        const token = user.token;
        const supportId = user.id;
        this.getTickets(supportId, token);
      }
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro ao conectar com o servidor!", { timeout: 3000 });
    }
  },
  methods: {
    redirectToLogin() {
      this.$router.push("/login");
    },
    redirectToReplyTicket(ticketId) {
      console.log("Redirecionando para o ticket ", ticketId);
      this.$router.push("/login");
    },
    async getTickets(supportId, token) {
      const response = await supportService.getPendingTickets(supportId, token);
      if (response.status === 200) {
        this.loadPendingTicketsData(response);
      } else {
        this.toast.error("Ocorreu um erro na resposta servidor!", { timeout: 3000 });
      }
    },
    async assistTicket(ticketId) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user.token;
        const response = await supportService.assistTicket(ticketId, token);
        if (response.status === 200) {
          console.log("Autorização recebida para tratar o ticket escolhido");
          this.redirectToReplyTicket(ticketId);
        }
      } catch (error) {
        console.log(error);
      }
    },
    loadPendingTicketsData(data = []) {
      data.forEach((item) => {
        // TODO: ticket_id
        const newItem = {
          ticket_id: 0,
          is_repeat: false,
          subject: item.subject,
          timestamp: item.created_at,
        };

        this.ticketsList.push(newItem);
      });
    },
    formatDate(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString("pt-BR", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>
