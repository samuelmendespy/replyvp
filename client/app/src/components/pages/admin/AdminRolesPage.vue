<template>
  <div class="container py-5">
    <h1 class="text-center mb-4">Admin Roles</h1>
    <div class="table-responsive">
      <table class="table table-striped table-bordered">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Roles</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>
              <div>
                <div
                  v-for="role in roles"
                  :key="role"
                  class="form-check form-check-inline"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`checkbox-${user.id}-${role}`"
                    :value="role"
                    v-model="user.assignedRoles"
                    @change="updateUserRoles(user.id, user.assignedRoles)"
                  />
                  <label class="form-check-label" :for="`checkbox-${user.id}-${role}`">
                    {{ role }}
                  </label>
                </div>
              </div>
            </td>
            <td>
              <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">
                Remover
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import adminService from "@/services/adminService";

export default {
  name: "AdminRolesPage",
  data() {
    return {
      users: [
        {
          id: 0,
          username: "test_user",
          assignedRoles: ["user", "support"],
        },
      ],
      roles: ["admin", "manager", "support", "user"],
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  async created() {
    try {
      // Autenticação JWT
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user.token;

      // Fetching usuários
      const response = await adminService.getAllUsers(token);
      const retrievedUsers = response;

      retrievedUsers.forEach((item) => {
        const userRoleMap = {
          1: "admin",
          2: "manager",
          3: "support",
          4: "user",
        };

        const newItem = {
          id: item.user_id,
          username: item.username,
          assignedRoles: [userRoleMap[item.role_id]] || ["user"],
        };
        this.users.push(newItem);
      });
      console.log(this.users);

      // this.users = retrievedUsers.map((user) => ({
      //   ...user,
      //   assignedRoles: user.roles || [],
      // }));
    } catch (error) {
      console.log(error);
      console.log("Erro ao conectar ao servidor. Verifique sua conexão.");
    }
  },
  methods: {
    async updateUserRoles(userId, newRoles) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user.token;

        const response = await adminService.updateUserRoles(userId, newRoles, token);
        if (response.data.success) {
          console.log("User updated");
        }
      } catch (error) {
        console.log(error);
        console.log("Erro ao conectar ao servidor. Tente novamente mais tarde.");
      }
    },
    async deleteUser(userId) {
      if (confirm("Tem certeza que deseja remover este usuário?")) {
        try {
          const storedUser = localStorage.getItem("user");
          if (storedUser && storedUser.token) {
            console.log("Teste");
          }
          const adminToken = storedUser.token;

          const response = await adminService.deleteUserAsAdmin(userId, adminToken);
          if (response.code === 204) {
            console.log("Usuário excluído");
          }
        } catch (error) {
          console.log(error);
          alert("Erro ao conectar ao servidor. Tente novamente mais tarde.");
        }
      }
    },
  },
};
</script>

<style scoped>
.table {
  margin-bottom: 2rem;
}
</style>
