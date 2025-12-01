import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const RouteProtect = ({ children }: any) => {
    const token = useSelector((state: any) => state.auth?.token);
    if (token) {
        return <>{children}</>;
    } else {
        return <Navigate to={"/login"} />;
    }
}


export const LoginProtect = ({ children }: any) => {
    const token = useSelector((state: any) => state.auth?.token);
    if (token) {
        return <Navigate to={"/dashboard"} />;
    } else {
        return <>{children}</>;
    }
}
    