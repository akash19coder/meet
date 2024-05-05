<h1 align='center'> meet. </h1>
<h6 align='center'> A video calling app </h6>

<p  align='center'>
  <img src='https://github.com/akash19coder/meet/assets/72060440/042a3897-5e0c-4d94-8c66-9e5d2008b49a' width='400' height='150'>
<p>

### Motivation
  
A long ago in February 2021, I stumbled upon an app called **Omegle**. It would match me with strangers and I could have conversation with them. For a 18 an year old who was aspiring to study Computer Science, it all became a dream to build an app like Omegle. Fast forward to 2024, when I am 22 and graduating in few months with a degree in CS, I have figured out app Omegle are built using **WebRTC** and **Signaling**

Hence, I have embarked on a journey to build an app like Omegle to navigate the level of engineering required to produce such system that operates flawlessly.

### Tech Stack
- React - a frontend Javascript Library
- Tailwind - a CSS library
- MaterialUI - a component library
- Socket.io - a javscript library enabling real time event based client-server communication
- WebRTC - peer-to-peer data sharing 

### Current Features
- Video Call with a peer over same network
- Signaling using Socket.io

### Future Features
- [ ] Capability to share video call over different network
- [ ] User Authentication and Authorization
- [ ] Design and Implement Stranger Matching Algorithms

### Quickstart

Step 1: Fork the repository
Step 2: Clone the repository into you local machine using:
```git clone https://www.github.com/akash19coder/meet```

#### Client
Step 3: Change the directory to meet/client using:
``` cd client ```

Step 4: The project uses libraries like Tailwind, MaterialUI, socket.io-client, and many more. Therefore install all the dependencies using:
```npm install ```

Step 5: Start the development build using:
```npm run dev ```

The local development server will start at **localhost:5173**

#### Server
Step 6: Come back to the root directory using:
```cd ..```

Step 7: Change the directory to meet/server using:
```cd server ```

Step 8: Install all the dependencies using:
``` npm install ```

Step 9: Start the server:
```npm run dev ```

The server will start at **localhost:3000**