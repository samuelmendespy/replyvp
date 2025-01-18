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
            {{ message.text.slice(0, 20) + (message.text.length > 20 ? "..." : "") }}
          </td>
          <td>{{ formatDate(message.timestamp) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="text-center mt-3">
      <button @click="$emit('back-to-contact')" class="btn btn-secondary">Voltar</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TicketHistoryPage",
  props: {
    messages: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sample: [
        {
          username: "samuelmendespy",
          subject: "1",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          timestamp: "2025-01-09 10:00:00",
        },
        {
          username: "samuelmendespy",
          subject: "2",
          text:
            "Vivamus id vulputate ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
          timestamp: "2025-01-09 12:00:00",
        },
        {
          username: "samuelmendespy",
          subject: "3",
          text:
            "Vestibulum eleifend aliquam lacus ut iaculis. Ut pharetra sapien nunc, ullamcorper vestibulum nisi vulputate in.",
          timestamp: "2025-01-09 14:00:00",
        },
      ],
      tickets: [],
      filteredTickets: [],
      ticketId: this.$route.query.ticketid || "Sem mensagem",
    };
  },
  async created() {
    try {
      const storedUser = localStorage.getItem("user");
      // const user = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.token) {
        const token = storedUser.token;
        console.log("Token detected");
        // TODO: Fix get tickets

        const response = await axios.get(
          `http://localhost:8080/api/users/getUserTickets.php`,
          {
            headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.sucess) { this.tickets = response.data.tickets.map(ticket => ({
        ...ticket,
      }));
          // Filter Tickets by User
          // Find ticket by ID
        alert("Sucess");
      } else {
        alert("Erro");
      }

      } else {
        console.log("Token not found");
      }
      

    } catch (err) {
      alert("Erro ao conectar ao servidor. Tente novamente mais tarde.")

    } finally{
      console.log("Requisição foi completa.");
    }
  },
  methods: {
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
