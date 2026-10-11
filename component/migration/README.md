# UCS migration helper

Prepared for the automatic UCS portal upgrade from WeKan 6.09 to 12.28.
This image is run only by `component/preinst`, not by the installed compose file.

Build from the repository root:

```sh
docker build -f component/migration/Dockerfile -t ghcr.io/wekan/wekan-ucs-migration:v12.28 .
```

The human maintainer must publish this image and register `preinst`, `compose`,
`inst`, `uinst`, `test` and the administrator READMEs in the new App Center version.
The full remaining release/test checklist is in
[WeKan's UCS design document](https://github.com/wekan/wekan/blob/main/docs/Design/Autoupdate/UCS.md).
No real UCS upgrade or Docker image build has been validated here yet.

The helper uses the host Docker socket only while migrating, to execute the
original database container's compatible `mongo` and `mongoexport` read tools.
The source app is stopped; its MongoDB is not upgraded or modified. A temporary instance of the version-tagged `ghcr.io/wekan/ferretdb:v1.92.0` image receives the
converted data, using the same image as the final database service. Its UID 1000
owns the database directory; the app's UID owns attachment/avatar files. Both temporary containers are removed before
App Center replaces the installed services with WeKan and FerretDB SQLite.

`importer.mjs` is vendored from `wekan/wekan` at commit
`97df5395193aca74b7481e149f6d8051577d3b28`, file
`snap-src/bin/migrate-mongo3-to-ferretdb.mjs`. It retains that code's license under
the WeKan MIT license; see `IMPORTER-LICENSE`. Local changes reject missing
CollectionFS binaries, truncated GridFS data and unmatched Meteor-Files records.
The wrapper also rejects partial-success reports and verifies filesystem versions
and source/target counts before writing the startup gate.

Run isolated tests with Node 26, setting TMPDIR to a writable task directory:

```sh
node --test tests/migration.test.mjs
```

These tests use a mocked Docker CLI. They do not replace a real 6.09 portal
upgrade, LDAP/browser/download checks, reboot testing and rollback rehearsal.

The original UCS `wekan-wekandb:6.09-ucs1` image was verified from its registry
manifest as MongoDB 3.2.21. The new database image is the SQLite-capable
`wekan/FerretDB` v1 fork, not upstream FerretDB v2. Univention mirrors the compose
source images into its own registry when publishing. The migration hook also
needs access to the pinned GHCR database, application and helper images.

Both WeKan release workflows now call `.github/workflows/ucs.yml` to create/resume
a portal draft and build a missing helper image once credentials and the source/
target UCS variables are configured. Production approval remains with the provider
and Univention. All previous compose image comments are preserved.
