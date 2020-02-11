{ pkgs ? import <nixpkgs> {} }:

let
  yarnPackage = pkgs.mkYarnPackage {
    src = pkgs.lib.sourceByRegex ./. [
      "package.json" "index.html"
      "lib" "lib/.*"
      "res" "res/.*"
    ];
    packageJson = ./package.json;
    yarnLock = ./yarn.lock;

    buildPhase = ''
      yarn bundle
    '';

    distPhase = "true";
  };
in pkgs.runCommand "www-icetan-org" {} ''
  mkdir -p $out
  cd ${yarnPackage}/libexec/*/deps/*/
  cp -r -t $out res/ index.html bundle.js
''
