{
  description = "Next.js AI Image Generator with OpenAI-compatible APIs (HuggingFace, Replicate) - Stable Diffusion Image Generation";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
  };

  outputs =
    {
      self,
      nixpkgs,
      systems,
    }:
    let
      # A helper that helps us define the attributes below for
      # all systems we care about.
      eachSystem =
        f:
        nixpkgs.lib.genAttrs (import systems) (
          system:
          f {
            inherit system;
            pkgs = nixpkgs.legacyPackages.${system};
          }
        );
    in
    {
      packages = eachSystem (
        { pkgs, ... }:
        let
          package = pkgs.callPackage ./nix/package.nix { };
        in
        {
          default = package;
          stable-diffusion-app = package;
          
          dockerImage = pkgs.dockerTools.buildLayeredImage {
            name = "diffusionx";
            tag = "latest";
            contents = [ package pkgs.bash pkgs.coreutils ];
            config = {
              Cmd = [ "${pkgs.lib.getExe package}" ];
              ExposedPorts = { "3000/tcp" = { }; };
              Env = [
                "NODE_ENV=production"
                "PORT=3000"
                "HOSTNAME=0.0.0.0"
              ];
            };
          };
        }
      );

      devShells = eachSystem (
        { pkgs, ... }: {
          default = pkgs.mkShell {
            name = "stable-diffusion-dev";
            buildInputs = with pkgs; [
              nodejs_20
              nodePackages.npm
              nodePackages.pnpm
              git
            ];
            shellHook = ''
              echo "🎨 DiffusionX Development Environment"
              echo "Node.js: $(node --version)"
              echo "npm: $(npm --version)"
              echo ""
              echo "Available commands:"
              echo "  npm run dev    - Start development server"
              echo "  npm run build  - Build for production"
              echo "  nix build      - Build with Nix"
              echo "  nix run        - Run the application"
            '';
          };
        }
      );

      nixosModules.default = ./nix/nixos-module.nix;
    };
}
