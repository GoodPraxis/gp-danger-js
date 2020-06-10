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

