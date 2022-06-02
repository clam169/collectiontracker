function checkAuth(req, res, next) {
  const isAuthenticated = req.oidc.isAuthenticated(); // magic thing from auth0; jwt cookie
  if (!isAuthenticated) {
    // send this IF user is not logged in
    // res.send({ error: 'must be authenticated' });
    res.redirect('/login');
    return;
  }
  next();
}

module.exports = checkAuth;
