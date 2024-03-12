import axios from "axios";

const API_URL = "/api/";

class Auth {

    login(username, password) {
        return axios
            .post("http://127.0.0.1:8000/login/", {
                username,
                password
            })
            .then(response => {
                console.log(response)
                if (response.data.access) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                }
                return response.data;
            });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

}

export default new Auth();