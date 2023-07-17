import { Progress, Spin } from "antd";
import { FC, Suspense } from "react";

const LayoutLoading = () => <Progress status="active" />;
const AppLoading = () => (
  <div className="w-full h-[100vh] flex justify-center items-center">
    <Spin size="large" />
  </div>
);
function Loader<T extends JSX.IntrinsicAttributes>(
  Component: FC<T>,
  type: "App" | "Layout" = "Layout",
) {
  return (props: T) => {
    const Load = type === "App" ? AppLoading : LayoutLoading;
    return (
      <Suspense fallback={<Load />}>
        <Component {...props} />
      </Suspense>
    );
  };
}
export default Loader;
