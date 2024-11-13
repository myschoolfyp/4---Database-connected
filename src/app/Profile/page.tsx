"use client";
import { useEffect, useState } from "react";

export default function Profile() {
  const [userData, setUserData] = useState<any>(null); // User profile data
  const [studentsData, setStudentsData] = useState<any[]>([]); // Students data for Admin
  const [adminsData, setAdminsData] = useState<any[]>([]); // Admin data for Admin
  const [userType, setUserType] = useState<string>(""); // User type (Admin)
  const [viewOption, setViewOption] = useState<string>("students"); // Toggle between 'students' and 'admins'

  useEffect(() => {
    // Fetch logged-in user profile data
    const fetchUserData = async () => {
      const response = await fetch("/api/user"); // Fetch logged-in user data
      const user = await response.json();
      setUserData(user);
      setUserType(user.userType); // Determine user type (admin in this case)
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch student data if viewOption is 'students'
    const fetchStudentData = async () => {
      if (viewOption === "students") {
        const response = await fetch("/api/students");
        const students = await response.json();
        setStudentsData(students);
      }
    };

    // Fetch admin data if viewOption is 'admins'
    const fetchAdminData = async () => {
      if (viewOption === "admins") {
        const response = await fetch("/api/adminss");
        const admins = await response.json();
        setAdminsData(admins);
      }
    };

    if (userType === "Admin") {
      fetchStudentData();
      fetchAdminData();
    }
  }, [viewOption, userType]);

  return (
    <div className="bg-cyan-500 my-5">
      <h1 className="text-center text-2xl my-5">Profile Page</h1>

      {userData && (
        <>
          {/* Profile Info */}
          <div className="text-center text-xl font-semibold">
            <p>Welcome, {userData.firstName} {userData.lastName}</p>
            <p>Email: {userData.email}</p>
            <p>Contact Number: {userData.contactNumber}</p>
          </div>

          {/* Option to toggle between Admins and Students data */}
          <div className="my-5 text-center">
            <button
              className={`px-4 py-2 mx-2 ${viewOption === "students" ? "bg-teal-600" : "bg-teal-400"}`}
              onClick={() => setViewOption("students")}
            >
              Show Students Data
            </button>
            <button
              className={`px-4 py-2 mx-2 ${viewOption === "admins" ? "bg-teal-600" : "bg-teal-400"}`}
              onClick={() => setViewOption("admins")}
            >
              Show Admins Data
            </button>
          </div>

          {/* Display Admin Data */}
          {viewOption === "admins" && (
            <div>
              <h2 className="text-center text-xl font-bold mt-5">Admins Data</h2>
              <table className="table-auto w-full mt-5 border-collapse">
                <thead>
                  <tr className="bg-teal-700 text-white">
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Email</th>
                    <th className="py-2 px-4">Contact Number</th>
                    <th className="py-2 px-4">Admin Code</th>
                  </tr>
                </thead>
                <tbody>
                  {adminsData.map((admin) => (
                    <tr key={admin._id} className="bg-white border-b">
                      <td className="py-2 px-4">{admin.firstName} {admin.lastName}</td>
                      <td className="py-2 px-4">{admin.email}</td>
                      <td className="py-2 px-4">{admin.contactNumber}</td>
                      <td className="py-2 px-4">{admin.adminCode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Display Students Data */}
          {viewOption === "students" && (
            <div>
              <h2 className="text-center text-xl font-bold mt-5">Students Data</h2>
              <table className="table-auto w-full mt-5 border-collapse">
                <thead>
                  <tr className="bg-teal-700 text-white">
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Class</th>
                    <th className="py-2 px-4">Subjects</th>
                    <th className="py-2 px-4">Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsData.map((student) => (
                    <tr key={student.id} className="bg-white border-b">
                      <td className="py-2 px-4">{student.name}</td>
                      <td className="py-2 px-4">{student.class}</td>
                      <td className="py-2 px-4">{student.subjects.join(", ")}</td>
                      <td className="py-2 px-4">{student.contact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}