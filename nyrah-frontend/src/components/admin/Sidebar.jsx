import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdOutlineFeaturedPlayList,
  MdAdminPanelSettings,
  MdAttachMoney,
} from "react-icons/md";
import { CiInstagram, CiDiscount1 } from "react-icons/ci";
import { AiOutlineProduct, AiOutlineTags } from "react-icons/ai";
import { TbShoppingBagCheck } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { RiDropdownList } from "react-icons/ri";
import { IoMdLogOut } from "react-icons/io";
import { BiCategoryAlt } from "react-icons/bi";
import { SlSizeFullscreen } from "react-icons/sl";
import { IoClose } from "react-icons/io5";

function Sidebar({ open, setOpen }) {
  const adminLinks = [
    { route: "DashBoard", icon: <MdDashboard /> },
    { route: "Products", icon: <AiOutlineProduct /> },
    { route: "Orders", icon: <TbShoppingBagCheck /> },
    { route: "Users", icon: <FaUsers /> },
    {
      route: "Options",
      icon: <RiDropdownList />,
      subRoute: [
        { route: "category", icon: <BiCategoryAlt /> },
        { route: "Size", icon: <SlSizeFullscreen /> },
        { route: "Feature", icon: <MdOutlineFeaturedPlayList /> },
        { route: "charges", icon: <MdAttachMoney /> },
        { route: "tags", icon: <AiOutlineTags /> },
        { route: "instapost", icon: <CiInstagram /> },
        { route: "discount", icon: <CiDiscount1 /> },
      ],
    },
    { route: "Logout", icon: <IoMdLogOut /> },
  ];
  return (
    <aside
      className={`absolute left-0  top-0 ${
        open
          ? "translate-x-0 md:translate-x-0 duration-400"
          : "duration-400 translate-x-[-100%] md:translate-x-0"
      }  bg-[#9F774C] w-64 px-3 py-4 h-screen z-10 md:static`}
    >
      <h2 className="flex relative items-center px-5 gap-2 uppercase text-2xl font-noto-serif-display font-light text-[#EFDCAB] pb-7">
        <MdAdminPanelSettings />
        Nyrah{" "}
        <IoClose
          className=" absolute right-1 md:hidden"
          onClick={() => setOpen(false)}
        />
      </h2>
      <ul className="menu w-full">
        {adminLinks.map((link, index) =>
          link.subRoute ? (
            <li className="relative z-[1]" key={index}>
              <details className="peer">
                <summary
                  className={
                    " items-center px-5 group py-3 gap-3 bg-transparent text-[#EFDCAB] text-sm font-roboto font-[400] tracking-wider"
                  }
                >
                  {link.icon}
                  {link.route.toLocaleUpperCase()}
                </summary>
                <ul>
                  {link.subRoute.map((sub, index) => (
                    <li key={index} className="relative bg-[#EFDCAB]">
                      <NavLink
                        onClick={() => setOpen(false)}
                        className={
                          "flex items-center px-7 group py-3 gap-3 bg-transparent  text-[#443627] text-sm font-roboto font-[400] tracking-wider hover:opacity-50 transition-all ease-in-out duration-200"
                        }
                        to={`/admin/${sub.route.toLocaleLowerCase()}`}
                      >
                        {sub.icon}
                        {sub.route.toLocaleUpperCase()}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ) : (
            <li key={index} className="relative z-[1]">
              <NavLink
                onClick={() => setOpen(false)}
                className={
                  "flex items-center px-5 group py-3 gap-3 bg-transparent peer text-[#EFDCAB] text-sm font-roboto font-[400] tracking-wider"
                }
                to={`/admin/${link.route.toLocaleLowerCase()}`}
              >
                {link.icon}
                {link.route.toLocaleUpperCase()}
              </NavLink>
              <div className="w-full outline-1 opacity-0 outline-[#EFDCAB] absolute left-0 h-full top-0 peer-hover:opacity-60 transition-all duration-200 ease-in-out z-[-1]"></div>
            </li>
          )
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;
