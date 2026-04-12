// roles can be an array of permitted role IDs, or strings if we extend it
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role_id)) {
            return res.status(403).json({
                message: `Role ID ${req.user ? req.user.role_id : 'Unknown'} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { authorize };
