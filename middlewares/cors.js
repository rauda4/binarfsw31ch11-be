const handleCors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://localhost:3000/');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,token, authorization'
  ); // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
};
module.exports = handleCors;
