async function handler(request, h, env) {
  const { name } = request.query;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        statusCode: 200,
        body: JSON.stringify({
          message: `Hello, ${name || "world"}!`,
        }),
      });
    }, 1000);
  });
}

module.exports = handler;
