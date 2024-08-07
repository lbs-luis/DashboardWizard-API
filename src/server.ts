import { app } from "./app";
import { PORT } from "@/../env";

app.listen({
  host: '0.0.0.0',
  port: PORT
}).then((adress) => console.log(`🔥 http server running at ${adress}`))
  .catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
  });