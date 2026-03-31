import { Outlet } from "react-router";
import Sidebar from "../components/ui/Sidebar";


const Layout= () => {
    return (
        <div className="layout-container">
            <Sidebar/>
            <div className="flex-1 overflow-y-scroll">
            <Outlet/>
            </div>
        </div>
    )
}

export default Layout;

