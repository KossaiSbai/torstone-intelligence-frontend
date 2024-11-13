import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import { MessageProps } from "./Message";
import TelegramIcon from "@mui/icons-material/Telegram";
import AssistantIcon from "@mui/icons-material/Assistant";
import { write_to_log } from "./global"; // import dependency
import Chat from "./Chat";

function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const getChatHistory = async () => {
    const result = await axios.get("http://192.168.1.31:8000/chat-history");
    setMessages(result.data);
  };

  const getCurrentUser = async () => {
    // const result = await axios.get("http://localhost:8000/current-user");
    setCurrentUser({});
  };

  const handleQuery = async () => {
    setLoading(true);
    setInput("Torstone Intelligence is working on your query...");
    write_to_log(
      `${currentUser.username} has asked the following question to Torstone Intelligence: ${input}`
    );
    const result = await axios.post("http://192.168.1.31:8000/query", {
      query: input,
    });
    let chatHistory = result.data.response.chat_history;
    chatHistory[chatHistory.length - 1].sources = result.data.response.sources;
    setMessages(chatHistory);
    setLoading(false);
    setInput("");
  };

  useEffect(() => {
    getCurrentUser();
    getChatHistory();
  }, []);

  const classN = loading ? "gradient-border" : "";
  return currentUser ? (
    <Box pb={"5%"}>
      <Box display={"flex"} justifyContent={"space-between"} mt={1} p={2}>
        <Box display={"flex"} alignItems={"center"}>
          <AssistantIcon
            style={{
              fontSize: "2.5rem",
              color: "#c4272c",
              marginRight: "0.5rem",
            }}
          />
          <Typography variant={"h4"} ml={1}>
            Torstone Intelligence
          </Typography>
        </Box>
      </Box>
      <Box pl={"15%"}>
        <Box className="chat-box">
          <Chat messages={messages} user={currentUser} />
        </Box>

        <Box className="chat-input-container">
          <TextField
            id="outlined-basic"
            variant="outlined"
            value={input}
            placeholder="Message to Torstone Intelligence"
            className={loading ? "gradient-border" : ""}
            onChange={(e) => setInput(e.target.value)}
            // InputProps={{
            //   endAdornment: <SearchIcon sx={{ color: "gray" }} />,
            // }}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "3rem",
                borderRadius: "8px",
              },
            }}
          />
          <Button
            variant="contained"
            sx={{ bgcolor: "#c4272c" }}
            onClick={handleQuery}
            disabled={loading}
          >
            <TelegramIcon style={{ color: "white" }} />
          </Button>
        </Box>
      </Box>
    </Box>
  ) : (
    <Box>Please log in</Box>
  );
}

export default App;
