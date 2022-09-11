import "regenerator-runtime";
import "dotenv/config";
import "./db";
// Videos -> Video
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4000;

const handleListening = () =>
  console.log(`Server listening on port 4000 http://localhost:${PORT}`);

app.listen(PORT, handleListening);
