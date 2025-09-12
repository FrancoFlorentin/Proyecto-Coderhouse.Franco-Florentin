import mongoose from 'mongoose';

// TODO - Cambiar el conection string a su base de datos si es que este no le funciona

export const initMongoDB = async() => {
  try {
    await mongoose.connect(process.env.BACKEND_URL.toString());
    console.log('Conectado a la base de datos de MongoDB');
  } catch (error) {
    console.log(`ERROR => ${error}`);
  }
}
  