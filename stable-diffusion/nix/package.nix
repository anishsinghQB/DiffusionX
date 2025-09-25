{ pkgs, lib }:
pkgs.buildNpmPackage {
  pname = "stable-diffusion-image-generator";
  version = "1.0.0";
  src = ../.;

  npmDeps = pkgs.importNpmLock {
    npmRoot = ../.;
  };
  npmConfigHook = pkgs.importNpmLock.npmConfigHook;

  postBuild = ''
    # Add a shebang to the server js file, then patch the shebang to use a
    # nixpkgs nodes binary
    sed -i '1s|^|#!/usr/bin/env node\n|' .next/standalone/server.js
    patchShebangs .next/standalone/server.js
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/{share,bin}

    cp -r .next/standalone $out/share/stable-diffusion-app/
    cp -r public $out/share/stable-diffusion-app/public

    mkdir -p $out/share/stable-diffusion-app/.next
    cp -r .next/static $out/share/stable-diffusion-app/.next/static

    # https://github.com/vercel/next.js/discussions/58864
    ln -s /var/cache/stable-diffusion-app $out/share/stable-diffusion-app/.next/cache

    chmod +x $out/share/stable-diffusion-app/server.js

    # we set a default port to support "nix run ..."
    makeWrapper $out/share/stable-diffusion-app/server.js $out/bin/stable-diffusion-image-generator \
      --set-default PORT 3000 \
      --set-default HOSTNAME 0.0.0.0

    runHook postInstall
  '';

  doDist = false;

  meta = {
    mainProgram = "stable-diffusion-image-generator";
    description = "AI Image Generator using Stable Diffusion with OpenAI-compatible APIs";
    homepage = "https://github.com/anishsinghQB/DiffusionX";
    license = lib.licenses.mit;
    maintainers = [ ];
    platforms = lib.platforms.all;
  };
}
