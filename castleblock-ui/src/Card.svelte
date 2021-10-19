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

<div class="card app-card">
  <div class="card-content content">
    <div class="media">
      {#if icons}
        <div class="media-left">
          <img
            class="image is-96x96"
            alt="logo"
            src="{`${window.location.origin}${pack.path}/latest/${
              icons.reverse()[icons.length - 1].src
            }`}" />
        </div>
      {/if}
      <div class="media-content">
        <p class="title is-5">
          <a
            target="_blank"
            href="{`${window.location.origin}${pack.path}/latest/`}"
            >{title || pack.name}</a>
        </p>
        {#if description}
          <p class="subtitle is-6">
            {description}
          </p>
        {/if}
      </div>
    </div>
  </div>
  <footer class="card-footer">
    <div class=" dropdown is-hoverable">
      <div class="dropdown-trigger">
        <button
          class="button is-small"
          aria-haspopup="true"
          aria-controls="dropdown-menu3">
          <span>versions</span>
          <span class="icon is-small">
            <i class="fas fa-angle-down" aria-hidden="true"></i>
          </span>
        </button>
      </div>
      <div class="dropdown-menu" id="dropdown-menu3" role="menu">
        <div class="dropdown-content">
          {#each pack.versions.reverse() as version, i}
            <a
              target="_blank"
              href="{`${window.location.origin}${pack.path}/${version}/`}"
              class="dropdown-item">
              {pack.name} - {version}
              {i == 0 ? "(latest)" : ""}
            </a>
          {/each}
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
.app-card {
  display: flex;
  flex-direction: column;
  min-width: 350px;
  width: 350px;
}
.content {
  flex: 1;
}
img {
  flex: 1;
}
</style>
