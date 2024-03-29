// import express from "express";
// import bodyParser from "body-parser";
// import jsonwebtoken from "jsonwebtoken";

// const app = express();


// app.use(bodyParser.json());

// const secret = "my-secret";

// app.post("/login", (req, res) => {
//   const { username, password } = req.body;

//   if (username === "admin" && password === "123") {
//     const token = jsonwebtoken.sign({ username }, secret, { expiresIn: "1h" });

//     res.status(200).json({ token });
//   } else {
//     res.status(401).json({ message: "Invalid username or password" });
//   }
// });

// app.get("/authen", (req, res) => {
//   let token: any;
//   // token =  req.headers.authorization.split(" ")[1];
 
//   try {
//     const decoded = jsonwebtoken.verify(token, secret);

//     res.status(200).json({ username: decoded.username });
//   } catch (e) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// });

// app.listen(3000, () => console.log("API is running on port 3000"));