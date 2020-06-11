import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL";

declare function warn(message: string): void;
declare function markdown(message: string): void;

declare var danger: DangerDSLType;

const BIG_MR_THRESHOLD = 10;

const checkMergeRequest = () => {
  const {
    assignee,
    changes_count: changesCount,
    description,
  } = danger.gitlab.mr;

  /*
  * Check if description exists.
  */
  if (description.trim().length === 0) {
    warn('This MR does not include a description.');
    markdown(`It's always good to include a description in your MR, even if it's
    just a few words.`);
  }

  /*
  * Check if MR is assigned to someone.
  */
  if (!assignee) {
    warn('Nobody is assigned to this MR.');
  }

  /*
  * Check if merge request is too big.
  */
  if (parseInt(changesCount, 10) > BIG_MR_THRESHOLD) {
    warn('Merge Request is quite large');
    markdown(`Your MR size seems relatively large (${changesCount} files).
    If your Merge Request contains multiple changes, split each into separate MR.
    This helps creating faster, easier reviews.`);
  }

  /*
  * Check if commits are worder properly.
  */
  let isWrongCommitFound = false;
  let isMergeCommitFound = false;
  let isFullStopFound = false;
  let isLongCommitFound = false;

  danger.gitlab.commits.forEach((commit) => {
    const words = commit.title.split(' ');
    if (words.length > 0) {
      if (words[0].endsWith('ed')
          || words[0].endsWith('ing')
          || ( words[0].endsWith('s') && !words[0].endsWith('ss'))) {
        isWrongCommitFound = true;
        warn(`This commit might be worded wrongly: \`${commit.title}\``);
      }
    }

    if (commit.title.startsWith('Merge branch')) {
      isMergeCommitFound = true;
      warn(`Unexpected merge commit found: \`${commit.title}\``);
    }

    if (commit.title.endsWith('.')) {
      isFullStopFound = true;
      warn(`Full stop in commit title found: \`${commit.title}\``);
    }

    if (commit.title.length > 50) {
      isLongCommitFound = true;
      warn(`Long commit message found: \`${commit.title}\``);
    }
  });

  if (isMergeCommitFound) {
    markdown(`It looks like your MR contains a merge commit. In most situations
    this should never be the case.`);
  }

  if (isWrongCommitFound) {
    markdown(`Commit messages look better when written using an imperative mood
    as opposed to a past tense. This means that it is preferred to write "Add
    file" instead of "Added file".`);
  }

  if (isFullStopFound) {
    markdown(`Full stops are not necessary at the end of commit messages.`);
  }

  if (isLongCommitFound) {
    markdown(`Ideally, the subject line of a commit should be 50 characters or
    less. Additional information can be included in the body of the commit
    message`);
  }

  if (isWrongCommitFound || isFullStopFound || isLongCommitFound) {
    markdown(`You can edit your commit message using \`git commit --amend\` and
    then do a force push with \`git push origin HEAD -f\`.`);
  }
};

export default checkMergeRequest;
