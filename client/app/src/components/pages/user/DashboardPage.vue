// TODO: Add Button to Edit User
<template>
  <div class="container mt-4">
    <div class="card shadow mb-4 border-0" style="background-color: #f8f9fa">
      <div class="card-body text-center">
        <img
          src="https://placehold.co/50x50.png"
          alt="Foto do usuário"
          class="rounded-circle mb-3 shadow"
          style="width: 120px; height: 120px; border: 4px solid #dee2e6"
        />
        <h5 class="card-title text-secondary fw-bold">{{ user.username }}</h5>
        <p class="card-text text-muted">{{ user.roles.join(" | ") }}</p>
        <div class="text-center mt-3">
          <button class="btn btn-secondary" @click="redirectToUpdateUserPage">
            Atualizar Cadastro
          </button>
        </div>
      </div>
    </div>

    <div class="card shadow border-0" style="background-color: #f8f9fa">
      <div class="card-body">
        <h5 class="card-title text-secondary fw-bold">Atendimentos do Usuário</h5>
        <ul class="list-group list-group-flush">
          <li
            v-for="ticket in userTicketsList"
            :key="ticket.id"
            class="list-group-item d-flex justify-content-between align-items-center"
            style="background-color: #f8f9fa; border: none"
          >
            <div>
              <small class="text-muted">{{ formatDateTime(ticket.timestamp) }}</small>
            </div>
            <div
              class="text-truncate text-secondary text-decoration-underline"
              style="max-width: 70%"
            >
              <router-link
                :to="{
                  name: 'MessagesPage',
                  query: {
                    ref: ticket.id,
                  },
                }"
                class="text-truncate text-secondary"
                style="max-width: 70%; cursor: pointer; text-decoration: none"
              >
                {{ truncateText(ticket.subject) }}
              </router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ticketService from "@/services/ticketService";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || {
        id: 0,
        username: "Guest",
        roles: ["Guest"],
      },
      userTicketsList: [
        {
          id: 0,
          timestamp: "2025-01-12T14:30:00",
          subject:
            "Suspendisse vehicula sapien felis, quis fermentum justo ultrices at. Ut ornare erat nec malesuada aliquet. Sed scelerisque, lorem eget maximus gravida, sem odio ultricies lectus, sit amet tincidunt tortor magna nec ex.",
          status: "Aberta",
        },
      ],
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
      }

      this.filteredTickets = await ticketService.getTickets(user.id);
      this.loadUserData(this.filteredTickets);
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro ao conectar com o servidor!", { timeout: 3000 });
    }
  },
  methods: {
    redirectToUpdateUserPage() {
      this.$router.push("/user/update");
    },
    loadUserData(data = []) {
      data.forEach((item) => {
        const statusMap = {
          open: "Aberta",
          closed: "Fechada",
          in_progress: "Em andamento",
        };
        const retrievedUserTicket = {
          id: item.id,
          subject: item.subject,
          status: statusMap[item.status] || "Desconhecido",
          timestamp: item.created_at,
        };
        this.userTicketsList.push(retrievedUserTicket);
      });
      console.log("User tickets found", this.userTicketsList.length);
    },
    formatDateTime(dateTime) {
      const date = new Date(dateTime);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    },
    truncateText(text) {
      return text.length > 30 ? text.slice(0, 30) + "..." : text;
    },
  },
};
</script>

<style>
.container {
  max-width: 600px;
}
.card {
  border-radius: 12px;
}
.list-group-item {
  border-bottom: 1px solid #dee2e6;
}
.list-group-item:last-child {
  border-bottom: none;
}
</style>
