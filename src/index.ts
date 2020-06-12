import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL";

declare function warn(message: string): void;
declare function markdown(message: string): void;
declare function message(message: string): void;

declare var danger: DangerDSLType;

const BIG_MR_THRESHOLD = 10;
const LONG_TITLE_THRESHOLD = 50;

const checkMergeRequest = () => {
  const {
    assignee,
    changes_count: changesCount,
    description,
  } = danger.gitlab.mr;

  const {
    modified_files: modifiedFiles,
    created_files: createdFiles,
  } = danger.git;

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
  * Check if commits are worded properly.
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

    if (commit.title.length > LONG_TITLE_THRESHOLD) {
      isLongCommitFound = true;
      warn(`Long commit message found: \`${commit.title}\``);
    }
  });

  if (isMergeCommitFound) {
    markdown(`It looks like your MR contains a merge commit. In most situations
    this should not be the case. If there is no major reason for it to be there,
    it's best if you squash that commit to keep a clean git history.`);
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
    markdown(`Ideally, the subject line of a commit should be
    ${LONG_TITLE_THRESHOLD} characters or less. Additional information can be
    included in the body of the commit message if needed.`);
  }

  if (isWrongCommitFound || isFullStopFound || isLongCommitFound) {
    markdown(`You can edit your commit message using \`git commit --amend\` and
    then do a force push with \`git push origin HEAD -f\`.`);
  }

  /*
   * Check package.json changes.
   */
  const isPackageChanged = modifiedFiles.includes('package.json');
  const isLockfileChanged = modifiedFiles.includes('package-lock.json');
  if (isPackageChanged && !isLockfileChanged) {
    warn('Changes were made to `package.json`, but not to `package-lock.json`');
    markdown(`It's unusual for \`package.json\` to change without the lock file
    changing too. If you changed packages, make sure you run \`npm install\`.`);
  }

  /*
   * Check created files for optimizable images.
   */
  const optimizableImages = createdFiles.filter(
    (name) => name.endsWith('.png') || name.endsWith('.gif'));

  if (optimizableImages.length > 0) {
    message('Image files have been added – make sure they have been optimized');
    markdown(`Make sure that any new images you add have been optimized using
    tools like [ImageOptim](https://imageoptim.com/) or similar.`)
  }
};

export default checkMergeRequest;
