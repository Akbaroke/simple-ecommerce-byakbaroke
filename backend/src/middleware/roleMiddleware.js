const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    const { role } = req.user;

    if (role !== requiredRole) {
      return res.status(403).json({ error: 'Forbidden: You do not have the required role' });
    }

    next(); 
  };
};

export default authorizeRole;
