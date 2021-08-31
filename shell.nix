with (import <nixpkgs> {});
mkShell {
  buildInputs = [
    pkgs.binutils
    pkgs.curl
    pkgs.perl
    pkgs.nodejs
    pkgs.docker
  ];

  shellHook = ''
    source <(npm completion)
    export NPM_TOKEN="$(cat ~/.npmrc | perl -ne '/artifactory\/api\/npm\/npm\/\/?:_authToken=(.*)$/ && print STDOUT "$1\n"')"

    npm run
  '';
}
