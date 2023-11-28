const isAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'administrador') {
      return next();
    }
    res.status(403).json({ success: false, error: 'Acceso no autorizado' });
  };
  
  module.exports = isAdmin;
  