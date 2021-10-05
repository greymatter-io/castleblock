<script>
import { onMount } from "svelte";
import axios from "axios";

import Card from "./Card.svelte";
import logo from "./Logo.png";

let packages = new Promise((resolve, reject) => {
  return axios
    .get(`${window.location.origin}/deployments`)
    .then((results) => resolve(results.data));
});
</script>

<svelte:head>
  <title>Castleblock Dashboard</title>
  <link rel="icon" href="favicon.png" type="image/png" />
</svelte:head>

<main>
  <div class="header">
    <div id="logo"><img  src="{logo}" height="80px" alt="CastleBlock Logo" /></div>
    <a href="#getting-started">Getting Started</a>
  </div>
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
  #logo {
    flex:1;
  }
  .header {
    display:flex;
  }
main {
  padding: 1em;
  margin: 0 auto;
}

.box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
