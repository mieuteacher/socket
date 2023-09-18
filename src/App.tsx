import axios from "axios";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";


function App() {
  const [messages, setMessages] = useState<any[]>([]);

  function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    axios.post("http://127.0.0.1:3000/api/v1/authen/login",
    {
      userName: (event.target as any).userName.value,
      password: (event.target as any).password.value
    })
    .then(res => {
      localStorage.setItem("token", res.data.token)
    })
  }

  const [socket, setSocket] = useState<Socket | null>(null)

  function handleConnectSocket() {
      let socket = io("http://127.0.0.1:3001", {
        reconnectionDelayMax: 10000,
        auth: {
          token: localStorage.getItem("token")
        }
      });
      setSocket(socket)
  }

  function sendMessage() {
    if(socket) {
      socket.emit("newMessage", {
        id: "Phước",
        content: "Chào serve 1233r"
      })
    }
  }
  
  useEffect(() => {
    console.log("đã vào!")
    if(socket) {
      console.log("đã vào!")
      socket.on('loadMessage', (body: any) => {
        setMessages([body,...messages])
      })
    }
  }, [socket, messages])
  return (
    <div>
      <h1>App nek</h1>
      <form  onSubmit={(e: React.FormEvent) => {
        handleLogin(e)
      }}>
        <div>
          username:
          <input name="userName" type="text"/>
        </div>
        <div>
          password:
          <input name="password" type="password"/>
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        <div>
          <button onClick={() => {
            localStorage.removeItem("token")
          }} type="button">Logout</button>
        </div>
      </form>
      <div>
       <button onClick={() => {
        if(window.confirm("ok")) {
          handleConnectSocket()
        }
       }}> join Chat</button>
      </div>
      <div>
        <button onClick={() => {
          sendMessage()
        }}>Send Message</button>
      </div>
      <div>
        <h2>Khung Chat</h2>
        <ul>
          {
            messages.map(message => {
              return (
                <li key={Date.now() * Math.random()}>UserId: {message.id}: {message.content}</li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

export default App
