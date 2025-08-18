import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  adminDeleteUser,
  adminUpdateUser,
} from "../../redux/apis/userApi";
import { MdDelete, MdOutlineVisibility } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

function Users() {
  const dispatch = useDispatch();
  const { adminUsers, adminLoading } = useSelector((state) => state.user);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { user: currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(adminDeleteUser(id))
      .unwrap()
      .then(() => toast.success("User deleted"))
      .catch((err) => toast.error(err));
  };

  const handleRoleChange = (id, newRole) => {
    dispatch(adminUpdateUser({ id, updates: { role: newRole } }))
      .unwrap()
      .then(() => toast.success("Role updated"))
      .catch((err) => toast.error(err));
  };

  return (
    <div>
      <div className="flex shadow-md p-2 justify-between items-center w-full">
        <h2 className="text-xl uppercase font-noto-serif font-[400] text-[#443627]">
          Users
        </h2>
      </div>

      <div className={`overflow-x-auto shadow-md mt-4`}>
        <h2 className="text-md tracking-wide p-4 uppercase font-roboto font-light">
          All Users
        </h2>

        {adminLoading ? (
          <div className="p-4">Loading...</div>
        ) : adminUsers?.length ? (
          <table className={`table`}>
            <thead>
              <tr>
                <th className="bg-[#443627] text-white border opacity-80">
                  No.
                </th>
                <th className="bg-[#443627] text-white border opacity-80">
                  ID
                </th>
                <th className="bg-[#443627] text-white border opacity-80">
                  Email
                </th>
                <th className="bg-[#443627] text-white border opacity-80">
                  Name
                </th>
                <th className="bg-[#443627] text-white border opacity-80">
                  Role
                </th>
                <th className="bg-[#443627] text-white border opacity-80">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {adminUsers
                .filter((u) => u._id !== currentUser._id)
                .map((user, index) => (
                  <tr key={user._id}>
                    <td className="border border-zinc-300">{index + 1}</td>
                    <td className="border border-zinc-300">{user._id}</td>
                    <td className="border border-zinc-300">{user.email}</td>
                    <td className="border border-zinc-300 capitalize">
                      {user.name ? user.name : "No name"}
                    </td>
                    <td className="border border-zinc-300">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="select select-bordered select-sm capitalize"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="text-xl border border-zinc-300">
                      <div
                        className="tooltip tooltip-left"
                        data-tip="Delete"
                        onClick={() => handleDelete(user._id)}
                      >
                        <MdDelete className="cursor-pointer text-red-700 me-2" />
                      </div>
                      <div
                        className="tooltip tooltip-left"
                        data-tip="View Details"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                      >
                        <MdOutlineVisibility className="cursor-pointer text-zinc-400" />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4">No users found</div>
        )}
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-[#00000075] bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-[90%] md:w-[400px] rounded shadow-lg p-6 relative capitalize font-roboto">
            <button
              className="absolute top-2 right-2"
              onClick={() => setShowModal(false)}
            >
              <IoClose className="cursor-pointer text-2xl text-zinc-500" />
            </button>
            <h2 className="text-lg font-roboto tracking-wider mb-4 uppercase font-light">
              User Details
            </h2>
            <p className="font-light ">
              <strong>ID:</strong> {selectedUser._id}
            </p>
            <p className="font-light ">
              <strong>Name:</strong>{" "}
              {selectedUser.name ? selectedUser.name : "no name"}
            </p>
            <p className="font-light lowercase ">
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p className="font-light ">
              <strong>Role:</strong> {selectedUser.role}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
