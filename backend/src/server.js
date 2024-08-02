import { execSync } from 'child_process';

try {
  execSync('node prisma/migrate.js', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to migrate or seed database:', error);
}

import app from './app.js';
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
