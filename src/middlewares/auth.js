// import jwt from 'jsonwebtoken
import passport from "passport";

// export const isAuthenticated = (req, res, next) => {
//   if (req.session?.user) return next()
//   return res.status(401).json({ error: "No autenticado" })
// }

// export const isAuthenticated = (req, res, next) => {
//   try {
//     // Leer cookie firmada
//     const token = req.signedCookies[process.env.COOKIE_NAME || "currentUser"];

//     if (!token) return res.status(401).json({ error: 'No autenticado' });

//     // Verificar token JWT
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(decoded)

//     // Guardar datos en req.user
//     req.user = decoded;
    
//     return next();

//   } catch (error) {
//     return res.status(401).json({ error: 'Token inválido o expirado' });
//   }
// };

export const isAuthenticated = passport.authenticate("current", {
  session: false
});

export const authorize = (role) => {
  return (req, res, next) => {
    isAuthenticated(req, res, next)
    if (req.session.user.role !== role) {
      return res.status(403).json({ error: "Área restringida, requiere el rol de: " + role })
    }
    next()
  }
}