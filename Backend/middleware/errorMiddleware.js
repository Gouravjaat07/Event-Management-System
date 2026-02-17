const errorHandler = (err, req, res, next) => {
    // res.status(res.statusCode || 500).json({
    //     message: err.message,
    // });

    if (res.headersSent) {
    return next(err);
  }

  const statusCode = res.statusCode && res.statusCode !== 200
    ? res.statusCode
    : 500;

  res.status(statusCode).json({
    message: err.message,
    success: false,
  });
};

export default errorHandler;