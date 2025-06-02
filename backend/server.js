import app from './index.js';

const port = 4000;

app.listen(port, () => {
  console.log(`Backend сервер запущен на http://localhost:${port}`);
});
