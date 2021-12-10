import Joke from "awesome-dev-jokes";

async function handler(request, h, env) {
  const myJoke = Joke.getRandomJoke();
  console.log("myJoke", myJoke);
  return myJoke;
}

export default handler;
