import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type FC, type PropsWithChildren } from "react";
import { authApi } from "../api";
import Loading from "../components/common/Loading";
import { useAppDispatch } from "../states";
import { patchAccount } from "../states/slices/account";
import * as socket from "../socket";

const InitWrapper: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { data, status } = useQuery({
    queryFn: authApi.getProfile,
    queryKey: ["profile"],
    refetchOnWindowFocus: false,
    retry: false,
  });
  const [socketConnecting, setSocketConnecting] = useState(true);
  useEffect(() => {
    if (status === "loading") return;
    socket.createConnect();
    setSocketConnecting(false);
    return () => {
      socket.disconnect();
      setSocketConnecting(true);
    };
  }, [status]);
  if (socketConnecting) return <Loading />;
  dispatch(patchAccount(data));
  return children;
};

export default InitWrapper;
