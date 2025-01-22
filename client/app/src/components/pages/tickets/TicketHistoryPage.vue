<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">Tickets gerados Recebidas</h2>
    <table class="table table-striped table-bordered">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Assunto</th>
          <th>Status</th>
          <th>Horário de Envio</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(message, index) in sample" :key="index">
          <td>{{ message.username }}</td>
          <td>{{ message.subject }}</td>
          <td>
            {{ message.status }}
          </td>
          <td>{{ formatDate(message.timestamp) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="text-center mt-3">
      <button class="btn btn-secondary" @click="redirectToNewTicket">Novo Ticket</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  name: "TicketHistoryPage",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || {
        id: 0,
        username: "Guest",
        roles: ["Guest"],
        token: "A",
      },
      sample: [
        {
          username: "samuelmendespy",
          subject: "1",
          status: "Closed",
          timestamp: "2025-01-09 10:00:00",
        },
      ],
      tickets: [],
      filteredTickets: [],
    };
  },
  async created() {
    const toast = useToast();
    try {
      // TODO: Use Auth Bearer with token to send user id
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        toast.error("Falha na autenticação!", { timeout: 3000 });
        // Redirect user
      } else {
        const response = await axios.get(`http://localhost:8080/api/tickets/list.php`, {
          params: {
            id: user.id,
          },
        });

        if (response.status === 200) {
          this.filteredTickets = response.data.tickets;
          console.log(this.filteredTickets);
          this.loadData(this.filteredTickets);
        } else {
          toast.error("Ocorreu um erro na resposta servidor!", { timeout: 3000 });
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Ocorreu um erro ao conectar com o servidor!", { timeout: 3000 });
    }
  },
  methods: {
    redirectToNewTicket() {
      this.$router.push("/tickets/new");
    },
    loadData(data = []) {
      data.forEach((item) => {
        const statusMap = {
          open: "Aberta",
          closed: "Fechada",
          in_progress: "Em andamento",
        };

        const newItem = {
          username: `User id: ${item.id}`,
          subject: item.subject,
          status: statusMap[item.status] || "Desconhecido",
          timestamp: item.created_at,
        };

        this.sample.push(newItem);
      });
      console.log("Data loaded");
      console.log(this.sample);
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
