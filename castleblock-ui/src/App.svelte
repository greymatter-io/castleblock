<script>
import { onMount } from "svelte";
import axios from "axios";

import Card from "./Card.svelte";
import logo from "./Logo.png";
import GettingStarted from "./GettingStarted.svelte";

let packages = new Promise((resolve, reject) => {
  return axios
    .get(`${window.location.origin}/apps`)
    .then((results) => resolve(results.data));
});

let webcomponents = new Promise((resolve, reject) => {
  return axios
    .get(`${window.location.origin}/webcomponents`)
    .then((results) => resolve(results.data));
});
let hash = window.location.hash;
onMount(() => {
  window.addEventListener(
    "hashchange",
    (e) => {
      hash = e.target.window.location.hash;
    },
    false
  );
});
</script>

<svelte:head>
  <title>Castleblock Dashboard</title>
  <link rel="icon" href="favicon.png" type="image/png" />
</svelte:head>
{#if hash == "#getting-started"}
  <GettingStarted />
{/if}
<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/">
      <img src="{logo}" alt="CastleBlock Logo" />
    </a>
  </div>
  <div class="navbar-end">
    <div class="navbar-item">
      <a href="./#">Apps</a>
    </div>

    <div class="navbar-item">
      <a href="#web-components">Web Components</a>
    </div>

    <div class="navbar-item">
      <a href="https://github.com/greymatter-io/castleblock#readme">Docs</a>
    </div>
    <div class="navbar-item">
      <a href="/api">API</a>
    </div>
    <div class="navbar-item">
      <div class="buttons">
        <a class="button is-info" href="#getting-started">
          <strong>Getting Started</strong>
        </a>
      </div>
    </div>
  </div>
</nav>
{#if hash != "#web-components"}
  <div class="container flex-wrap">
    {#await packages}
      <div>Loading</div>
    {:then results}
      {#each results as pack}
        <Card pack="{pack}" />
      {/each}
    {/await}
  </div>
{:else}
  <div class="container flex-wrap">
    {#await webcomponents}
      <div>Loading</div>
    {:then results}
      {#each results as pack}
        <Card pack="{pack}" />
      {/each}
    {/await}
  </div>
{/if}

<style>
.flex-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px 20px;
}
img {
  min-height: 80px;
}
</style>
