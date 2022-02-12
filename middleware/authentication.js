function checkAuth(req, res, next) {
  const isAuthenticated = req.oidc.isAuthenticated();
  if (!isAuthenticated) {
    res.send({ error: 'must be authenticated' });
    return;
  }
  next();
}

module.exports = checkAuth;
