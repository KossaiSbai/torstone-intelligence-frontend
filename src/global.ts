import axios from "axios";

export async function write_to_log(message: string) {
    await axios.post("http://localhost:8000/log", {
        message: message,
    })
}