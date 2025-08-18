import { NavLink } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { LuMenu } from "react-icons/lu";

function AdminNav({ setOpen }) {
  return (
    <header
      className="px-4 py-5 md:px-8 z-5 bg-white flex justify-between md:justify-end items-center bg-red absolute top-0 left-0 w-full "
      style={{ boxShadow: "0px 0px 1px #979797" }}
    >
      <LuMenu
        onClick={() => setOpen(true)}
        className="md:hidden text-xl opacity-75 text-[#443627] cursor-pointer"
      />
      <div>
        <ul className="flex items-center gap-5">
          <li className="flex-items-center">
            <NavLink to={"/"}>
              <IoHome className="text-[#443627] opacity-50 hover:opacity-100 duration-300 text-xl" />
            </NavLink>
          </li>
          <li className="flex items-center">
            <NavLink to={"/user/profile"}>
              <FaUserCircle className="text-[#443627] opacity-50 hover:opacity-100 duration-300 text-xl" />
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default AdminNav;
