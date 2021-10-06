<script>
export let isActive = false;
export let items = [];
export let label = "items";
</script>

<div
  class="dropdown {isActive ? 'is-active' : ''}"
  on:click="{() => (isActive = !isActive)}">
  <div class="dropdown-trigger">
    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu3">
      <span>label</span>
      <span class="icon is-small">
        <i class="fas fa-angle-down" aria-hidden="true"></i>
      </span>
    </button>
  </div>
  <div class="dropdown-menu" id="dropdown-menu3" role="menu">
    <div class="dropdown-content">
      {#each items as item}
        <slot prop="{item}" />
      {/each}
    </div>
  </div>
</div>
