import app from "./app.js";
import { config } from "./config.js";

app.listen(config.port, () => {
  console.log(`BarberSoft backend listening on port ${config.port}`);
});
