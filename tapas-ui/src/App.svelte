<svelte:options tag="tapas-ui" />

<script>
import Card from "./Card.svelte";

import { onMount } from "svelte";
import axios from "axios";
let env = new Promise((resolve, reject) => {
  return axios.get("./env.json").then((results) => resolve(results.data));
});
let google = new Promise((resolve, reject) => {
  return axios
    .get(
      `${window.location.origin}/proxy/https://dog.ceo/api/breeds/image/random`
    )
    .then((results) => {
      console.log(results.data);
      resolve(results.data);
    });
});

let packages = new Promise((resolve, reject) => {
  return axios
    .get(`${window.location.origin}/deployments`)
    .then((results) => resolve(results.data));
});
</script>

<svelte:head>
  <title>Tapas Dashboard</title>
</svelte:head>

<main>
  <h1>UI Catalog</h1>
  <p>
    Join the microfrontend (MFE) revolution today! Microfrontends apply much of
    the same principles as microservices, but to user interfaces. Read more <a
      href="https://micro-frontends.org/">here</a
    >!
  </p>

  <h3>Deploying a Microfrontend</h3>
  <p>
    Deploying couldn't be simpler. Just build your application and transpile it
    to minified static assets and run the following command.
    <code class="block">tapas-cli -n cool-calculator -d ./build/</code>
  </p>
  <div class="box">
  {#await packages}
    <div>Loading</div>
  {:then results}
    {#each results as pack}
      <Card pack="{pack}" />
    {/each}
  {/await}
  </div>
</main>

<style>
main {
  padding: 1em;
  margin: 0 auto;
}

h1 {
  color: #ff3e00;
  text-transform: uppercase;
  font-size: 2em;
  font-weight: 100;
}
.block {
  display: block;
  background: #e6e6e6;
  padding: 0.5em;
  margin: 0.5em;
  text-align: left;
}
  .box {
    display:flex;
    flex-wrap:wrap;
  }
</style>
