const checkRole = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  // Extrae el nombre del rol ya sea un objeto populated o un string directo
  const userRole = typeof req.user.rol === 'object' 
    ? req.user.rol.nombre 
    : (req.user.rol || req.user.role);

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ error: 'Acceso denegado: no tienes permisos suficientes' });
  }

  next();
};

module.exports = checkRole;