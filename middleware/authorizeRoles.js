const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      const userRoles = req.user.roles;
      const authorized = roles.some((role) => userRoles.includes(role));

      if (!authorized) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.log('Error --', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    next();
  };
};

module.exports = authorizeRoles;
