<script>
  import {onMount} from "svelte";
  import axios from "axios";
   let env= new Promise((resolve, reject)=>{
    return axios.get('./env.json').then(results=>resolve(results.data));
  });

 
  let packages = new Promise((resolve, reject)=>{
      return axios.get(`${window.location.origin}/deployments`).then(results=>resolve(results.data));
  });

</script>

<svelte:head>
  <title>MFE</title>
</svelte:head>
<svelte:options tag="tapas-ui"></svelte:options>
<main>
	<h1>Microfrontend Catalog</h1>
    <p>
    Join the microfrontend (MFE) revolution today! Microfrontends apply much of the same principles as microservices, but to user interfaces. Read more <a href="https://micro-frontends.org/">here</a>!
    </p>

    <h3>Deploying a Microfrontend</h3>
    <p>
    Deploying couldn't be simpler. Just build your application and transpile it to minified static assets and run the following command.
    <code class="block">tapas-cli -n cool-calculator -d ./build/</code>
    </p>
    {#await packages}
      <div>Loading</div>
    {:then results}
      {#each results as pack}
        <details>
          <summary><a target="_blank" href={`${window.location.origin}${pack.path}/latest/`}>{pack.name}</a></summary>
          <p>
            {#each pack.versions.reverse() as version,i}
              <div>
                <a target="_blank" href={`${window.location.origin}${pack.path}/${version}/`}>
                  {pack.name} - {version} {i==0 ? '(latest)':''}
                </a>
              </div>
            {/each}
          </p>
        </details>
      {/each}
    {/await}

</main>

<style>
	main {
		padding: 1em;
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 2em;
		font-weight: 100;
	}
    .block {
      display:block;
      background: #e6e6e6;
      padding:0.5em;
      margin:0.5em;
      text-align:left;
    }

</style>
