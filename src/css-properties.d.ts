// oxlint-disable-next-line import/no-unassigned-import -- Load React before augmenting its CSSProperties interface.
import "react";

declare module "react" {
  interface CSSProperties {
    [property: `--${string}`]: string | number | undefined;
  }
}
