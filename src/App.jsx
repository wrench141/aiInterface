import { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

// const socket = io("http://localhost:3000"); // Make sure this matches your server URL

const socket = io("https://aiserver-gxon.onrender.com");

function App() {
  const [input, setInput] = useState("");
  const resp = useRef();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("convid", (conv_id) => {
      const extMsgCont = document.getElementById(conv_id);
      if(!extMsgCont){
        const sessionMessage = document.createElement("p");
        sessionMessage.classList.add("ai");
        sessionMessage.id = conv_id;
        sessionMessage.textContent = "WrenchJr: ";
        console.log(sessionMessage);
        resp.current.appendChild(sessionMessage);
      }
    })

    socket.on("response", (response, conv_id) => {
      console.log("Response from server:", response);
      const sMsg = document.getElementById(conv_id);
      sMsg.textContent += response;
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("connect");
      socket.off("response");
      socket.off("disconnect");
    };
  }, []);

  const submitHandler = () => {
    console.log("Sending query:", input);
    let query_inp = input;
    const query = document.createElement("p");
    query.classList.add("query");
    query.textContent = "Me: " + input;
    resp.current.appendChild(query)
    socket.emit("query", query_inp);
  };

  return (
    <div
      className="container" >
      <div className="input">
        <input
          type="text"
          value={input}
          className="inp"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Make a prompt or chat..."
        />
        <button className="btn" onClick={submitHandler}>
          Send
        </button>
      </div>
      <div className="response">
        <div ref={resp} style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          
        </div>
      </div>
    </div>
  );
}

export default App;
