# gp-danger-js

[Danger JS](https://github.com/danger/danger-js) setup used for GitLab merge
requests by [Good Praxis](https://goodpraxis.coop). The main goal is to address
issues that are not covered in build, test and lint phases.

## Features
* Checks if someone is assigned to MR
* Checks if MR is too big
* Checks if MR has description
* Checks whether commits in MR look correct
* Checks `package.json` changes
* Checks which font files are added
* Checks if SVG files contain unnecessary data
* Checks if SVG files accidentally embed bitmaps
* Encourages users to optimize images

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
### [0.5.0] - 2020-06-13
#### Added
- SVG file checks
### [0.4.0] - 2020-06-12
#### Added
- Font file checks
### [0.3.0] - 2020-06-12
#### Added
- `package.json` check
- Detecting new images
#### Changed
- Copy has been updated
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
