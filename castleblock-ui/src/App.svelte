<svelte:options tag="castleblock-ui" />

<script>
import Card from "./Card.svelte";

import { onMount } from "svelte";
import axios from "axios";
import logo from "./Logo.png";


let env = new Promise((resolve, reject) => {
  return axios.get("./env.json").then((results) => resolve(results.data));
});
  console.log('w', window.location)
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
  <title>Castleblock Dashboard </title>
  <link rel="icon" href="favicon.png" type="image/png" />
</svelte:head>

<main>
  <img src={logo} height="80px" />
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
