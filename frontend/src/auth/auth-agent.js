import axios from "axios";

class AuthAgent {

    login(username, password) {
        return axios
            .post("http://localhost:8000/auth/login/", {
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

export default new AuthAgent();