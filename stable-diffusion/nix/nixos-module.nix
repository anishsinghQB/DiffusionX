{
  config,
  pkgs,
  lib,
  ...
}:
let
  cfg = config.services.stable-diffusion-app;
  stable-diffusion-app = pkgs.callPackage ./package.nix { };
in
{
  options = {
    services.stable-diffusion-app = {
      enable = lib.mkEnableOption "Enable the Stable Diffusion AI Image Generator app";

      hostname = lib.mkOption {
        type = lib.types.str;
        default = "0.0.0.0";
        example = "127.0.0.1";
        description = ''
          The hostname under which the app should be accessible.
        '';
      };

      port = lib.mkOption {
        type = lib.types.port;
        default = 3000;
        example = 3000;
        description = ''
          The port under which the app should be accessible.
        '';
      };

      openFirewall = lib.mkOption {
        type = lib.types.bool;
        default = true;
        description = ''
          Whether to open ports in the firewall for this application.
        '';
      };

      huggingfaceApiKey = lib.mkOption {
        type = lib.types.nullOr lib.types.str;
        default = null;
        description = ''
          HuggingFace API key for AI image generation. 
          If not provided, the app will use fallback mode with placeholder images.
        '';
      };

      replicateApiToken = lib.mkOption {
        type = lib.types.nullOr lib.types.str;
        default = null;
        description = ''
          Replicate API token for AI image generation.
          If not provided, the app will use fallback mode with placeholder images.
        '';
      };
    };
  };

  config = lib.mkIf cfg.enable {
    users.groups.stable-diffusion-app = { };
    users.users.stable-diffusion-app = {
      isSystemUser = true;
      group = "stable-diffusion-app";
    };

    systemd.services.stable-diffusion-app = {
      wantedBy = [ "multi-user.target" ];
      description = "Stable Diffusion AI Image Generator App";
      after = [ "network.target" ];
      environment = {
        HOSTNAME = cfg.hostname;
        PORT = toString cfg.port;
        NODE_ENV = "production";
      } // lib.optionalAttrs (cfg.huggingfaceApiKey != null) {
        HUGGINGFACE_API_KEY = cfg.huggingfaceApiKey;
      } // lib.optionalAttrs (cfg.replicateApiToken != null) {
        REPLICATE_API_TOKEN = cfg.replicateApiToken;
      };
      serviceConfig = {
        ExecStart = "${lib.getExe stable-diffusion-app}";
        User = "stable-diffusion-app";
        Group = "stable-diffusion-app";
        CacheDirectory = "stable-diffusion-app";
        Restart = "always";
        RestartSec = "10s";
      };
    };

    networking.firewall = lib.mkIf cfg.openFirewall {
      allowedTCPPorts = [ cfg.port ];
    };
  };
}
