const checkRole = (allowedRoles) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.rol)){
        return res.status(403).json({error: 'no tienes permiso para ingresar'});

    }
    next();
}

module.exports = checkRole;