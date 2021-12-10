module.exports = function handler(request, response) {
  const { name } = request.query;
  return {
    statusCode: 200,
    body: `Goodbye, ${name || "world"}!`,
  };
};
