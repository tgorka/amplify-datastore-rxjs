
# [Choice] Node.js version: 16, 14, 12
ARG VARIANT=16
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}
# list of mcr repos: https://mcr.microsoft.com/v2/mcr/hello-world/tags/list
# list of versions: https://mcr.microsoft.com/v2/{namespace/repo}/tags/list
# list of typescript versions: https://mcr.microsoft.com/v2/vscode/devcontainers/typescript-node/tags/list

ENV DEBIAN_FRONTEND noninteractive

# Update args in docker-compose.yaml to set the UID/GID of the "node" user.
#ARG USERNAME=$USERNAME
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN if [ "$USER_GID" != "1000" ] || [ "$USER_UID" != "1000" ]; then groupmod --gid $USER_GID $USERNAME && usermod --uid $USER_UID --gid $USER_GID $USERNAME; fi

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node modules
# RUN su node -c "npm install -g <your-package-list-here>"