<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="card-title text-center mb-4">Página de Atualização Cadastral</h2>
            <form @submit.prevent="updateUser">
              <div class="mb-3">
                <label for="username" class="form-label">Nome de usuário</label>
                <input
                  type="text"
                  id="username"
                  class="form-control"
                  v-model="username"
                  placeholder="Digite seu nome de usuário"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Endereço de email</label>
                <input
                  type="email"
                  id="email"
                  class="form-control"
                  v-model="email"
                  placeholder="Digite seu endereço de email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="old_password" class="form-label">Senha Atual</label>
                <input
                  type="password"
                  id="password"
                  class="form-control"
                  v-model="password"
                  placeholder="Digite sua senha atual"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Endereço de email</label>
                <input
                  type="email"
                  id="new_email"
                  class="form-control"
                  v-model="newEmail"
                  placeholder="Digite seu endereço de email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="new_password" class="form-label">Nova Senha (Opcional)</label>
                <input
                  type="password"
                  id="new_password"
                  class="form-control"
                  v-model="newPassword"
                  placeholder="Digite sua nova senha"
                />
              </div>
              <div v-if="error" class="alert alert-danger mt-2" role="alert">
                {{ error }}
              </div>
              <div class="d-grid gap-2 mb-3">
                <button type="submit" class="btn btn-primary">Atualizar Cadastro</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userService from "@/services/userService";
import { useToast } from "vue-toastification";

export default {
  name: "UpdateUserPage",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      newEmail: "",
      newPassword: "",
      permission: false,
      error: null,
      user: JSON.parse(localStorage.getItem("user")) || {
        id: 0,
        username: "Guest",
        roles: ["Guest"],
      },
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async updateUser() {
      this.error = null;

      if (
        !this.username ||
        !this.email ||
        !this.oldPassword ||
        !this.newEmail ||
        !this.newPassword ||
        !this.permission
      ) {
        this.error = "Todos os campos obrigatórios devem ser preenchidos.";
        return;
      }

      const response = userService.updateUser(
        this.user.id,
        this.oldPassword,
        this.oldEmail,
        this.newEmail,
        this.newPassword
      );

      if (response === 200) {
        this.toast.success("Seus dados foram atualizados com sucesso!", {
          timeout: 3000,
        });
        this.$router.push("/dashboard");
      }
    },
  },
};
</script>
