export default function handler(request, response) {
	  const { name } = request.query;
	  res.end(`Goodbye ${name}!`);
}
