# Change history for ui-myprofile

## 8.0.0 (IN PROGRESS)

* Save button remains enabled despite validation errors on My profile form. Refs UIMPROF-76.
* bump stripes to 8.0.0 for Orchid/2023-R1. Refs UIMPROF-77.

## 7.2.0 (https://github.com/folio-org/ui-myprofile/tree/v7.2.0) (2022-10-25)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v7.1.0...v7.2.0)

* Translations updates

## 7.1.0 (https://github.com/folio-org/ui-myprofile/tree/v7.1.0) (2022-06-20)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v7.0.0...v7.1.0)

* Refactor away from `react-intl-safe-html`. Refs UIMPROF-58.
* Replace `babel-eslint` with `@babel/eslint-parser`. Refs UIMPROF-68.
* FE: update outdated dependencies. Refs FOLIO-3477.
* update NodeJS to v16 in GitHub Actions. Refs UIMPROF-71.
* FE: update outdated dependencies. Ref UIMPROF-69

## 7.0.0 (https://github.com/folio-org/ui-myprofile/tree/v7.0.0) (2022-03-01)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v6.0.0...v7.0.0)

* Upgrade `@folio/react-intl-safe-html` for compatibility with `@folio/stripes` `v7`. Refs UIMPROF-63.
* Fix Jest tests run problems. Refs UIMPROF-65.

## 6.0.0 (https://github.com/folio-org/ui-myprofile/tree/v6.0.0) (2021-10-01)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v5.0.0...v6.0.0)
* Compile Translation Files into AST Format. Refs UIMPROF-57.
* Increment stripes to v7 and react v17. Refs UIMPROF-60.

## 5.0.0 (https://github.com/folio-org/ui-myprofile/tree/v5.0.0) (2021-03-01)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v4.0.0...v5.0.0)

* Add permission descriptions to translations. Refs UIMPROF-49.
* Update to stripes v6. Refs UIMPROF-52.
* Add PERSONAL_DATA_DISCLOSURE.md. Refs UIMPROF-52.
* Update to stripes-cli v2.
* UI tests replacement with Jest+RTL. Refs FAT-70.

## 4.0.0 (https://github.com/folio-org/ui-myprofile/tree/v4.0.0) (2020-10-07)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v3.0.0...v4.0.0)

* Avoid calling `setState` from a promise that may resolve after unmount.
* Refactor from `bigtest/mirage` to `miragejs`.
* Increment `@folio/stripes` to `v5`, `react-router` to `v5`, `react-intl` to `v5`. Refs UIMPROF-47.

## [3.0.0](https://github.com/folio-org/ui-myprofile/tree/v3.0.0) (2020-06-09)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v2.0.0...v3.0.0)

* Purge `intlShape` in prep for `react-intl` `v4` migration. Update to `@folio/stripes` `v4.0.0`. Migrate `react-intl-safe-html` to `v2.0`. Refs STRIPES-672.
* Prefer `stripes.actsAs` to the deprecated `stripes.type` in `package.json`. Refs STCOR-148.
* Migrate `react-intl-safe-html` to `v2.0`. Refs STRIPES-672.
* Update translation strings.

## [2.0.0](https://github.com/folio-org/ui-myprofile/tree/v2.0.0) (2020-03-13)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v1.8.0...v2.0.0)

* Update eslint to v6.2.1. Refs UIMPROF-41.
* Update translations strings
* Migrate to `stripes` `v3.0.0` and move `react-intl` and `react-router` to peerDependencies.

## [1.8.0](https://github.com/folio-org/ui-myprofile/tree/v1.8.0) (2019-12-03)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v1.7.0...v1.8.0)

* Update translations strings
* Move Save button to the footer (UIMPROF-38)

## [1.7.0](https://github.com/folio-org/ui-myprofile/tree/v1.7.0) (2019-07-24)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v1.6.0...v1.7.0)

* Use granular permissions for settings items (UITEN-35)

## [1.6.0](https://github.com/folio-org/ui-myprofile/tree/v1.6.0) (2019-05-06)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v1.5.0...v1.6.0)

* Update translation strings

## [1.5.0](https://github.com/folio-org/ui-myprofile/tree/v1.5.0) (2019-03-14)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v1.4.0...v1.5.0)

* Change permission name (UIU-831)
* Update testing configuration (UIMPROF-32)
* Update translation strings

## [1.4.0](https://github.com/folio-org/ui-myprofile/tree/v1.4.0) (2019-01-25)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v1.3.0...v1.4.0)

* Upgrade to stripes v2.0.0.

## [1.3.0](https://github.com/folio-org/ui-myprofile/tree/v1.3.0) (2019-01-16)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v1.2.0...v1.3.0)

* Remove stripes-cli from dependencies

## [1.2.0](https://github.com/folio-org/ui-myprofile/tree/v1.2.0) (2018-12-11)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v1.1.0...v1.2.0)

* Move `PasswordStrength` component to `stripes-components` (UIU-689)
* Use documented `react-intl` patterns instead of `stripes.intl` (UIMPROF-28)

## [1.1.0](https://github.com/folio-org/ui-myprofile/tree/v1.1.0) (2018-10-04)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v1.0.0...v1.1.0)

* Change `handleChangePasswordError` method (UIMPROF-13)
* Add password strength meter integration (UIMPROF-20)
* Add validation for new password input field (UIMPROF-12)
* Change API url for change password (MODLOGIN-53)
* Add API permissions for Change Password page
* Use `stripes` framework v1.0.0

## [1.0.0](https://github.com/folio-org/ui-myprofile/tree/v1.0.0) (2018-09-18)

* Update `stripes-form` dependency to v1.0.0

## [0.2.0](https://github.com/folio-org/ui-myprofile/tree/v0.2.0) (2018-09-05)
[Full Changelog](https://github.com/folio-org/ui-myprofile/compare/v0.1.0...v0.2.0)

* Create My profile landing page (UIU-567)
* Add "Change Password" page (UIMPROF-3)
* Access Change my password from Folio Top Toolbar (UIU-563)
* Fix permissions issue in package.json (UIMPROF-8)
* Handle confirmation popup about unsaved form fields issue after successful form submission (UIMPROF-9)
* Provide `isLocalLogin` function in the module itself. Depends on stripes-core v2.10.7. Fixes UIMPROF-14
* Update translation strings

## [0.1.0](https://github.com/folio-org/ui-myprofile/tree/v0.1.0) (2017-05-16)

* Will be the first formal release
