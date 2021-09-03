<script>
import axios from "axios";

import { onMount } from "svelte";
export let pack = {};
onMount(() => {
  console.log("mounted");
  if (pack.latestManifest) {
    axios.get(pack.latestManifest).then((results) => {
      console.log("GOT MANI", results.data);
      title = results.data.name;
      description = results.data.description;
      icons = results.data.icons;
    });
  }
});
export let title = null;
export let description = null;
export let icons = null;
</script>

<div class="box">
  <div class="icon">
{#if icons}
        <picture >
          {#each icons.reverse() as icon}
            <source srcset="{`${pack.path}/latest/${icon.src}`}" />
          {/each}
          <img alt="logo" width="60px" />
        </picture>
      {/if}
  </div>
  <details>
    <summary>
      
      <a
        target="_blank"
        href="{`${window.location.origin}${pack.path}/latest/`}"
        >{title || pack.name}</a
      >
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
</div>

<style>
.box {
  display:inline-block;
  background: white;
  border: 1px solid black;
  border-radius: 10px;
  margin: 10px 10px;
  padding: 10px;
  width: 300px;
  min-height:100px;
  display:flex;
}
  .icon {
    min-width:60px;
    height:60px;
    background:#f7f7f7;
    margin:10px;
  }
  summary {
    flex:1;
    
  }
</style>
