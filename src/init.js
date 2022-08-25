import "dotenv/config";
import "./db";
// Videos -> Video
import "./models/Videos";
import "./models/User";
import app from "./server";

const PORT = 4000;

const handleListening = () =>
  console.log(`Server listening on port 4000 http://localhost:${PORT}`);

app.listen(PORT, handleListening);
