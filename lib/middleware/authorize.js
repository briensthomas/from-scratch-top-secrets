module.exports = async (req, res, next) => {
  try {
    // console.log('req.user.email', req.body.email.split('@').pop());
    const check = req.body.email.split('@').pop();
    if (!req.body || check !== 'defense.gov') throw new Error('Hitting the auth middleware');
    next();
  } catch(err) {
    err.status = 403;
    next(err);
  }
};
