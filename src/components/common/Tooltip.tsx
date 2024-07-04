import { TooltipProps, Tooltip as DefaultTooltip } from "antd";
import type { FC } from "react";

const Tooltip: FC<TooltipProps> = (props) => {
  return (
    <DefaultTooltip
      {...props}
      color="white"
      title={
        <p className="text-slate-950">
          {typeof props.title === "function" ? props.title() : props.title}
        </p>
      }
    />
  );
};

export default Tooltip;
