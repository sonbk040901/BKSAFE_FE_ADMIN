export const PendingUser = ({
  size = 32,
  color = "black",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    width={size}
    height={size}
    viewBox={"0 0 32 32"}
  >
    <g>
      <path
        d="M19 28H7c-.6 0-1-.4-1-1v-2c0-5.5 4.5-10 10-10 1.8 0 3.6.5 5.2 1.5.5.3.6.9.3 1.4s-.9.6-1.4.3c-3.8-2.3-8.7-1.1-11 2.7C8.4 22.1 8 23.5 8 25v1h11c.6 0 1 .4 1 1s-.4 1-1 1zM16 14c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"
        fill={color}
        opacity="1"
        data-original={color}
      ></path>
      <path
        d="M25 28c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"
        fill={color}
        opacity="1"
        data-original={color}
      ></path>
      <path
        d="M26 25c-.3 0-.5-.1-.7-.3l-1-1c-.2-.2-.3-.4-.3-.7v-1c0-.6.4-1 1-1s1 .4 1 1v.6l.7.7c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3z"
        fill={color}
        opacity="1"
        data-original={color}
      ></path>
    </g>
  </svg>
);
