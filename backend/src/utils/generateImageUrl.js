export default function generateImageUrl(name) {
  const slugname = name.toLowerCase().replace(/\s+/g, '+');
  return `https://avatar.iran.liara.run/username?username=${slugname}`;
}
