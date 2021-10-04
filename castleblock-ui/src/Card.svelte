<script>
import axios from "axios";

import { onMount } from "svelte";
export let pack = {};
onMount(() => {
  if (pack.latestManifest) {
    axios
      .get(`${window.location.origin}/${pack.latestManifest}`)
      .then((results) => {
        title = results.data.name;
        description = results.data.description;
        icons = results.data.icons;
      });
  }
});
export let title;
export let description;
export let icons;
</script>

<div class="box">
  <div class="icon">
    {#if icons}
      <picture>
        {#each icons.reverse() as icon}
          <source
            srcset="{`${window.location.origin}${pack.path}/latest/${icon.src}`}" />
        {/each}
        <img alt="logo" width="60px" />
      </picture>
    {/if}
  </div>
  <div class="right-side">
    <details>
      <summary>
        <a
          target="_blank"
          href="{`${window.location.origin}${pack.path}/latest/`}"
          >{title || pack.name}</a>
        {#if description}
          <div>{description}</div>
        {/if}
      </summary>
      <p>
        {#each pack.versions.reverse() as version, i}
          <div>
            <a
              target="_blank"
              href="{`${window.location.origin}${pack.path}/${version}/`}">
              {pack.name} - {version}
              {i == 0 ? "(latest)" : ""}
            </a>
          </div>
        {/each}
      </p>
    </details>

    <div class="deployment-version">
      {pack.versions.slice(-1)[0]}
    </div>
  </div>
</div>

<style>
.box {
  display: inline-block;
  background: #f9f9f9;
  border: 1px solid black;
  border-radius: 10px;
  margin: 10px 10px;
  padding: 10px;
  display: flex;
  min-width: 200px;
  width: 300px;
}

.icon {
  min-width: 60px;
  height: 60px;
  background: #f7f7f7;
  margin: 10px;
}
details {
  flex: 1;
}
.right-side {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.deployment-version {
  text-align: right;
  font-size: 12px;
}
</style>
