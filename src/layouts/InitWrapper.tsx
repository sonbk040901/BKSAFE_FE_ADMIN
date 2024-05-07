import { useQuery } from "@tanstack/react-query";
import type { FC, PropsWithChildren } from "react";
import { authApi } from "../api";
import Loading from "../components/common/Loading";
import { useAppDispatch } from "../states";
import { patchAccount } from "../states/slices/account";

const InitWrapper: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { data, status } = useQuery({
    queryFn: authApi.getProfile,
    queryKey: ["profile"],
    refetchOnWindowFocus: false,
    retry: false,
  });
  if (status === "loading") return <Loading />;
  dispatch(patchAccount(data));
  return children;
};

export default InitWrapper;
