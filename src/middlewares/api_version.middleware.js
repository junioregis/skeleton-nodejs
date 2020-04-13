const API_VERSIONS = [1];

module.exports = (req, res, next) => {
  const apiVersion = req.headers["api_version"];

  if (typeof apiVersion !== "undefined") {
    const version = parseInt(apiVersion);

    if (API_VERSIONS.includes(version)) {
      req.apiVersion = version;
      next();
    } else {
      res.status(401).json();
    }
  } else {
    res.status(401).json();
  }
};
