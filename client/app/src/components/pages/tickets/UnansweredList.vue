<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">Tickets Abertos</h2>
    <table class="table table-striped table-bordered">
      <thead class="table-dark">
        <tr>
          <th>Reincidência</th>
          <th>Assunto</th>
          <th>Última mensagem</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(message, index) in sample" :key="index">
          <td>{{ message.is_repeat ? "Reincidente" : "Primeiro" }}</td>
          <td>
            {{
              message.subject.slice(0, 20) + (message.subject.length > 20 ? "..." : "")
            }}
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
export default {
  name: "UnansweredList",
  data() {
    return {
      sample: [
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
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        toast.error("Falha na autenticação!", { timeout: 3000 });
        // Redirect user
        this.redirectToLogin();
      } else {
        const response = await axios.get(
          `http://localhost:8080/api/tickets/open_tickets.php`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response.status === 200) {
          this.openedTickets = response.data.open_tickets;
          console.log(this.openedTickets);
          this.loadOpenedTicketsData(this.openedTickets);
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
    redirectToLogin() {
      this.$router.push("/login");
    },
    loadOpenedTicketsData(data = []) {
      data.forEach((item) => {
        const statusMap = {
          open: "Aberta",
          closed: "Fechada",
          in_progress: "Em andamento",
        };

        const newItem = {
          username: `${item.username}`,
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
