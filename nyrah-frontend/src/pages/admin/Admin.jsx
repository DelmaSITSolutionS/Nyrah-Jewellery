import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import AdminNav from "../../components/admin/AdminNav";
import { useState } from "react";

function Admin() {
  const [open,setOpen] = useState(false)
  return (
    <div className="h-screen flex">
      <Sidebar open={open} setOpen={setOpen} />
      <main className="w-full px-4 md:px-8 pt-17 relative  overflow-y-auto">
        <AdminNav setOpen={setOpen}/>
        <Outlet />
      </main>
    </div>
  );
}

export default Admin;
