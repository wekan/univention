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
The source app is stopped; its MongoDB is not upgraded or modified. A temporary
FerretDB receives the converted data. Both temporary containers are removed before
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
