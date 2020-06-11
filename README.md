# gp-danger-js

[Danger JS](https://github.com/danger/danger-js) setup used for GitLab merge
requests by [Good Praxis](https://goodpraxis.coop).

## Features
* Checks if someone is assigned to MR
* Checks if MR is too big
* Checks if MR has description

## Prerequisites
Make sure you have read and followed the steps described at the
[*Getting Started*](https://danger.systems/js/guides/getting_started.html)
section of the Danger documentation.

## Usage
Install the package:

    npm install @goodpraxis/danger-js --save-dev

Create a `dangerfile.ts` with the following contents:

    import checkMergeRequest from '@goodpraxis/danger-js';

    checkMergeRequest();

## Changelog
### [0.2.1] - 2020-06-11
#### Changed
- Updated dependencies
- Fixed typo
### [0.2.0] - 2020-06-11
#### Added
- Type declarations
- Commit message checks
#### Changed
- Compilation target now set to `es6`
- Reduced big MR threshold from 20 to 10
### [0.1.0] - 2020-06-10
#### Added
- First version with initial checks
