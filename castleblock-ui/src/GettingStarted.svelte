<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Getting Started</p>
      <a href="./" class="delete" aria-label="close">&nbsp;</a>
    </header>
    <section class="modal-card-body">
      <div class="content">
        <ol>
          <li>
            <p>
              Install castleblock CLI, available at <a
                href="https://www.npmjs.com/package/castleblock">NPM</a>
              and
              <a
                href="https://github.com/greymatter-io/castleblock/tree/master/castleblock-cli"
                >Github</a
              >.
            </p>
            <pre>npm install -g castleblock</pre>
          </li>
          <li>
            Make a web app (<a href="https://svelte.dev/">svelte</a>,
            <a href="https://reactjs.org">react</a>,
            <a href="https://vuejs.org/">vue</a>,
            <a href="https://angular.io">angular</a>)
          </li>
          <li>
            Make sure your app has a manifest.json
            <pre>
      {JSON.stringify({
      "short_name": "my-app", //required
      "version": "1.2.3", //required
      "name": "My Application",
      "description": "An example application",
"icons": {
"48": "icon.png",
"96": "icon@2x.png"
}
      }, null, 2)}
    </pre>
          </li>
          <li>
            Get a <a href="{window.location.href}token">token</a>.
          </li>
          <li>
            Deploy your app with castleblock
            <pre>castleblock deploy --dist ./dist</pre>
          </li>
        </ol>
      </div>
    </section>
    <footer class="modal-card-foot">
      <a href="./" class="button is-dark" aria-label="close">Close</a>
    </footer>
  </div>
</div>
