import jwt from 'jsonwebtoken';

export const generateToken = ({ userId, email, name, role }) => {
  return jwt.sign({ userId, email, name, role }, process.env.TOKEN_SECRET, {
    expiresIn: '7d', // Set an appropriate expiration time
  });
};
