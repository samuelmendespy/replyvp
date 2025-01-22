<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="card-title text-center mb-4">
              Apagar sua conta em IA.ContactCenter
            </h2>
            <form @submit.prevent="testDeleteAccount">
              <div class="mb-3">
                <label for="email" class="form-label"
                  >Confirme o seu endereço de email</label
                >
                <input
                  type="email"
                  id="email"
                  class="form-control"
                  v-model="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Confirme sua senha</label>
                <input
                  type="password"
                  id="password"
                  class="form-control"
                  v-model="password"
                  placeholder="Senha"
                  required
                />
              </div>
              <div class="mb-3">
                <input
                  type="checkbox"
                  id="confirmation"
                  class="form-check-input"
                  v-model="confirmation"
                  required
                />
                <label class="form-check-label" for="confirmation">
                  <a>Confirmo que desejo marcar minha conta para exclusão.</a>
                </label>
              </div>
              <div v-if="error" class="alert alert-danger mt-2" role="alert">
                {{ error }}
              </div>
              <div class="d-grid gap-2 mb-3">
                <button type="submit" class="btn btn-danger">Excluir conta</button>
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
  name: "TerminateAccount",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || {
        id: 0,
        username: "Guest",
        roles: ["Guest"],
        token: "A",
      },
      password: "",
      email: "",
      confirmation: false,
      error: null,
    };
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    testDeleteAccount() {
      // TODO: Implement method to delete account
      if (this.confirmation) {
        this.testScheduleDeletion();
      } else {
        alert(`Operação cancelada! \n Retornando para página inicial!`);
      }
    },
    testScheduleDeletion() {
      axios
        .delete("http://localhost:8080/api/users/delete.php", {
          id: this.user.id,
        })
        .then((response) => {
          this.toast.success("Sucesso ao encerrar a conta!", { timeout: 3000 });
          console.log("O cadastro do usuário foi apagado com sucesso", response.data);
        })
        .catch((error) => {
          this.toast.error("Falha ao encerrar a conta!", { timeout: 3000 });
          console.error("Falha ao delete o recurso", error);
        });
      this.$router.push("/");
    },
  },
};
</script>
