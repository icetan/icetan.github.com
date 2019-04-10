{ pkgs ? import (fetchTarball https://nixos.org/channels/nixos-19.03/nixexprs.tar.xz) {}
, yarn2nix ? import (fetchTarball https://github.com/moretea/yarn2nix/archive/780e33a07fd821e09ab5b05223ddb4ca15ac663f.tar.gz) { inherit pkgs; }
}: (yarn2nix.mkYarnPackage {
  name = "www-icetan-org";
  src = pkgs.lib.sourceByRegex ./. [ "package.json" "lib(/.*)?" "res(/.*)?" "index.html" ];
  packageJson = ./package.json;
  yarnLock = ./yarn.lock;

  buildPhase = ''
    yarn bundle
  '';

  installPhase = ''
    mkdir -p $out
    cp -r -t $out res/ index.html deps/*/bundle.js
  '';

  distPhase = "true";
})
