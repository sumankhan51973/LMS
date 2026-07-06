import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const AdminRequests = () => {
  const { backendUrl, getToken } = useContext(AppContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(
        `${backendUrl}/api/admin/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setRequests(data.requests);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (id) => {
    try {
      const token = await getToken();

      const { data } = await axios.put(
        `${backendUrl}/api/admin/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchRequests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const rejectRequest = async (id) => {
    try {
      const token = await getToken();

      const { data } = await axios.put(
        `${backendUrl}/api/admin/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchRequests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg">
        Loading requests...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8 text-cyan-700">
        Educator Requests
      </h1>

      {requests.length === 0 ? (
        <div className="text-gray-500 text-lg">
          No educator requests found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-cyan-600 text-white">
              <tr>
                <th className="py-3 px-5 text-left">Name</th>
                <th className="py-3 px-5 text-left">Email</th>
                <th className="py-3 px-5 text-left">Status</th>
                <th className="py-3 px-5 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr
                  key={request._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-4 px-5">{request.name}</td>

                  <td className="py-4 px-5">{request.email}</td>

                  <td className="py-4 px-5 capitalize">
                    {request.status}
                  </td>

                  <td className="py-4 px-5 flex justify-center gap-3">
                    {request.status === "pending" ? (
                      <>
                        <button
                          onClick={() =>
                            approveRequest(request._id)
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            rejectRequest(request._id)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="font-semibold text-gray-600">
                        {request.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;