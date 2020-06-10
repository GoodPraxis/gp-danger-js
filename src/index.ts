import { DangerDSLType } from "../node_modules/danger/distribution/dsl/DangerDSL"

declare function warn(message: string): void;
declare function markdown(message: string): void;

declare var danger: DangerDSLType;

const { changes_count: changesCount, description, assignee } = danger.gitlab.mr;

const checkMergeRequest = () => {
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
  if (parseInt(changesCount, 10) > 20) {
    warn('Merge Request is quite large');
    markdown(`Your MR size seems relatively large (${changesCount} files).
    If your Merge Request contains multiple changes, split each into separate MR.
    This helps creating faster, easier reviews.`);
  }
};

export default checkMergeRequest;
