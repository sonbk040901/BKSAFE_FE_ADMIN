// icon:mail-outline | Ionicons https://ionicons.com/ | Ionic Framework
import * as React from "react";

function IconMailOutline(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M88 96 H424 A40 40 0 0 1 464 136 V376 A40 40 0 0 1 424 416 H88 A40 40 0 0 1 48 376 V136 A40 40 0 0 1 88 96 z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M112 160l144 112 144-112"
      />
    </svg>
  );
}

export default IconMailOutline;
