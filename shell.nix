with (import <nixpkgs> {});
mkShell {
  buildInputs = [
    pkgs.binutils
    pkgs.curl
    pkgs.nodejs
  ];

  shellHook = ''
  '';
}
