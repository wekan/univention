# Build from the univention repository root. Release this helper with the UCS app.
ARG WEKAN_IMAGE=ghcr.io/wekan/wekan:v12.28
FROM docker:27.5.1-cli AS cli
FROM ${WEKAN_IMAGE}
USER root
# The CLI is used only by the one-shot migration, never mounted into the app.
COPY --from=cli /usr/local/bin/docker /usr/local/bin/docker
COPY component/migration /opt/ucs-migration
RUN chmod 755 /opt/ucs-migration/tools/*
ENV BUNDLE_ROOT=/build MONGO_BIN_DIR=/opt/ucs-migration/tools SRC_PORT=27017 SRC_DB=wekan \
    TARGET_MONGO_URL=mongodb://127.0.0.1:27017/wekan FILES_DIR=/data/files \
    WRITABLE_PATH=/data STATUS_FILE=/data/ucs-migration-status.json MIGRATION_PORT=8099
CMD ["node", "/opt/ucs-migration/run.mjs"]
