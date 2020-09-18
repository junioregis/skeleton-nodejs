const App = require("./app");

const PORT = 3000;
const HOST = "0.0.0.0";

const app = new App(PORT, HOST);

app.start();
