// Carga variables de entorno, conecta a Mongo y levanta HTTP.
// Mantener este archivo pequeño y de responsabilidad única.

import 'dotenv/config'
import mongoose from 'mongoose'
import app from './src/app.js'
import { Server } from 'socket.io';

const { MONGO_URL, PORT = 8080 } = process.env

await mongoose.connect(MONGO_URL)
console.log(`Mongo conectado`);

const server = app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});

// Para tener socket en el req para usarlo dentro de las rutas
const io = new Server(server);
app.set("io", io);

process.on('SIGINT', async () => {
  console.log('\n👋 Cerrando…');
  await mongoose.disconnect();
  server.close(() => process.exit(0));
});