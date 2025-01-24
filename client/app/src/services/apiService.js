import axios from "axios";

const TICKETS_API_URL = "http://localhost:8080/api/tickets";

const apiService = {
  async getTickets(userId) {
    try {
      const response = await axios.get(`${TICKETS_API_URL}/list.php`, {
        params: { id: userId },
      });
      return response.data.tickets;
    } catch (error) {
      console.error("Erro ao buscar tickets:", error);
      throw error;
    }
  },
  async createTicket(userId, subject, message) {
    try {
      const response = await axios.post(`${TICKETS_API_URL}/create.php`, {
        user_id: userId,
        subject: subject,
        message: message,
      });

      if (response.status === 201) {
        return response.data.ticket_id;
      }
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      throw error;
    }
  },
};

export default apiService;