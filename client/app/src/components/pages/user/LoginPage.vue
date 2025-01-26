<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="card-title text-center mb-4">Entrar em IA.ContactCenter</h2>
            <form @submit.prevent="handleUserSignIn">
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
                <label for="password" class="form-label">Senha</label>
                <input
                  type="password"
                  id="password"
                  class="form-control"
                  v-model="password"
                  placeholder="Digite sua senha"
                  required
                />
                <p class="mt-2">
                  Não consegue entrar em sua conta? <a href="#">Recuperar acesso</a>
                </p>
              </div>
              <div v-if="error" class="alert alert-danger mt-2" role="alert">
                {{ error }}
              </div>
              <div class="d-grid gap-2 mb-3">
                <button type="submit" class="btn btn-primary">Fazer login</button>
              </div>
              <p class="text-center">
                Ainda não tem cadastro?
                <router-link to="/register">Cadastre-se</router-link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginUser } from "@/services/authService";

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      error: null,
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      this.$router.push("/dashboard");
    }
  },
  methods: {
    async handleUserSignIn() {
      this.error = null;
      const response = await loginUser(this.username, this.password);

      if (response.status === 200) {
        this.$router.push("/dashboard");
      } else {
        this.error = response.error || "Erro ao tentar fazer login.";
      }

      this.username = "";
      this.password = "";
    },
  },
};
</script>
