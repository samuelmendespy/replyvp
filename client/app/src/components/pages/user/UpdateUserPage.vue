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
                  id="old_password"
                  class="form-control"
                  v-model="oldPassword"
                  placeholder="Digite sua senha atual"
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
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  name: "UpdateUserPage",
  data() {
    return {
      username: "",
      email: "",
      oldPassword: "",
      newPassword: "",
      permission: false,
      error: null,
      userId: 1,
      oldEmail: "",
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    async updateUser() {
      this.error = null;

      if (!this.username || !this.email || !this.oldPassword || !this.permission) {
        this.error = "Todos os campos obrigatórios devem ser preenchidos.";
        return;
      }

      const updatedData = {
        id: this.userId,
        old_password: this.oldPassword,
        old_email: this.oldEmail,
        new_email: this.email,
        new_password: this.newPassword || undefined,
      };

      try {
        const response = await axios.put(
          "http://localhost:8080/api/users/update.php",
          updatedData
        );

        if (response.status === 200) {
          this.toast.success("Seus dados foram atualizados com sucesso!", {
            timeout: 3000,
          });
          this.$router.push("/dashboard");
        }
      } catch (error) {
        if (error.response) {
          this.error = error.response.data.error || "Erro ao atualizar os dados";
        } else {
          this.error = "Erro de rede ou servidor";
        }
      }
    },
  },
};
</script>
