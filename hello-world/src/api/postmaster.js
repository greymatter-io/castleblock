module.exports = function handler(request) {
  const payload = request.payload;
  console.log("payload", payload);
  return {
    statusCode: 200,
    body: JSON.stringify({ payload }),
  };
};
