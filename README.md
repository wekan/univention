# Wekan for Univention

- [Wekan Univention-specific Feature Requests and Bug Reports](https://github.com/wekan/univention/issues),
  for example about integrations to Univention and other Univention App Center apps
- [Wekan at Univention App Center](https://www.univention.com/products/univention-app-center/app-catalog/wekan/)
- [Wekan Commercial Support](https://wekan.team)

## General info about Wekan

- [Wekan website](https://wekan.github.io)
- [Wekan ChangeLog](https://github.com/wekan/wekan/blob/master/CHANGELOG.md)
- [Wekan documentation](https://github.com/wekan/wekan/wiki)
- [General Wekan Feature Requests and Bug Reports](https://github.com/wekan/wekan/issues)

## Prepared 12.28 portal upgrade

The new `component/compose` uses two services: WeKan and FerretDB SQLite.
`component/preinst` automatically backs up and migrates a 6.09 installation during
the UCS App Center upgrade, moving attachments and avatars to filesystem storage.
The helper image must be built/published and the hooks registered before release.
A real UCS upgrade still needs acceptance testing.

See [migration helper](component/migration/README.md) and the
[remaining maintainer steps](https://github.com/wekan/wekan/blob/main/docs/Design/Autoupdate/UCS.md).

## Repair legacy MongoDB

https://github.com/wekan/wekan/wiki/Repair-MongoDB

## About this repo

This repo contains Univention specific Wekan release files.

## Directory structure of this repo
```
├── component
│   ├── all
│   │   ├── Packages
│   │   ├── Packages.bz2
│   │   ├── Packages.gz
│   │   ├── Release
│   │   └── Release.gpg
│   ├── amd64
│   │   ├── Packages
│   │   ├── Packages.bz2
│   │   ├── Packages.gz
│   │   ├── Release
│   │   └── Release.gpg
│   ├── compose
│   ├── i386
│   │   ├── Packages
│   │   ├── Packages.bz2
│   │   ├── Packages.gz
│   │   ├── Release
│   │   └── Release.gpg
│   ├── inst
│   ├── README_APPLIANCE_DE
│   ├── README_APPLIANCE_EN
│   ├── README_DE
│   ├── README_EN
│   ├── test
│   └── uinst
├── LICENSE
├── meta
│   ├── appliance_bootsplash_logo.svg
│   ├── appliance_logo.svg
│   ├── appliance_portal_logo.svg
│   ├── appliance_umc_header_logo.svg
│   ├── appliance_welcome_screen_logo.svg
│   ├── logo_detail_page.svg
│   ├── logo.svg
│   ├── thumbnail_1.png
│   ├── thumbnail_2.png
│   ├── thumbnail_3.png
│   ├── wekan_20190520122559.ini
│   └── wekan.meta
└── README.md
```
