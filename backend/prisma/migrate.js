import { execSync } from 'child_process';

try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  execSync('node prisma/seed.js', { stdio: 'inherit' });
  console.log('Migration and seeding completed successfully.');
} catch (error) {
  console.error('Error running migration or seeding:', error);
  process.exit(1);
}
