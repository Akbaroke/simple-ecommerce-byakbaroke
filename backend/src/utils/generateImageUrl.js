export default function generateImageUrl(name) {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid name: Name must be a non-empty string.');
  }

  const slugName = encodeURIComponent(name.trim().toLowerCase().replace(/\s+/g, '+'));
  return `https://avatar.iran.liara.run/username?username=${slugName}`;
}
