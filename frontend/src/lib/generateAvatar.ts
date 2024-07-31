export default function generateAvatar(name: string) {
  if (!name) return '';
  const slugname = name.toLowerCase().replace(/\s+/g, '-');
  const gender = Math.random() < 0.5 ? 'boy' : 'girl';
  return `https://avatar.iran.liara.run/public/${gender}?username=${slugname}-${Math.floor(
    Math.random() * 1000
  )}`;
}
