import axios from "axios";

const ADMIN_API_URL = "http://localhost:8080/api/users";

const adminService = {
  
  async getAllUsers(token) {
    try {

      const response = await axios.get(
        `${ADMIN_API_URL}/all_users.php`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    if (response.status === 200) {
      return response.data;
    } else {
      return response;
    } 
  } catch (error) {
    console.log(error);
  }
  }
    
};

export default adminService;