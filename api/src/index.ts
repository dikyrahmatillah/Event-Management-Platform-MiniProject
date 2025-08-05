import { App } from "./app.js";

const PORT = process.env.PORT || "8000";
const server = new App();
console.log(server);
server.listen(PORT);
