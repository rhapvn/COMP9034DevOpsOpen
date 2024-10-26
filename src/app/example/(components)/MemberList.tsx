//This should be server component.
//If you make it client component, you need useState and useEffect.

import getMembers from "@/db/api/getMembers";

export const MemberList = async () => {
  const rows = await getMembers();

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="mb-4 text-xl font-bold">From Members Table in Vercel Postgres Database</div>
      <div>This is a server component.</div>
      <table className="min-w-full border border-gray-200 bg-white">
        <thead>
          <tr>
            <th className="border-b border-r border-gray-200 bg-gray-50 px-4 py-2">User Id</th>
            <th className="border-b border-r border-gray-200 bg-gray-50 px-4 py-2">User name</th>
            <th className="border-b border-r border-gray-200 bg-gray-50 px-4 py-2">Name</th>
            <th className="border-b border-gray-200 bg-gray-50 px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.userId} className="hover:bg-gray-100">
              <td className="border-b border-r border-gray-200 px-4 py-2">{row.userId}</td>
              <td className="border-b border-r border-gray-200 px-4 py-2">{row.username}</td>
              <td className="border-b border-r border-gray-200 px-4 py-2">{row.fullName}</td>
              <td className="border-b border-gray-200 px-4 py-2">{row.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

//■■ Next.js Client Component Example ■■
// 'use client';

// import { useState, useEffect } from 'react';
// import getMembers from "@/db/api/getMembers";

// export const MemberList = () => {
//   const [rows, setRows] = useState([]);

//   useEffect(() => {
//     const fetchMembers = async () => {
//       const members = await getMembers();
//       setRows(members);
//     };
//     fetchMembers();
//   }, []);

//   return (
//     <div className="container mx-auto max-w-4xl p-4">
//       <div className="mb-4 text-xl font-bold">From Members Table in Vercel Postgres Database</div>
//       <div>This is now a client component.</div>
//       <table className="min-w-full border border-gray-200 bg-white">
//         <thead>
//           <tr>
//             <th className="border-b border-r border-gray-200 bg-gray-50 px-4 py-2">User Id</th>
//             <th className="border-b border-r border-gray-200 bg-gray-50 px-4 py-2">User name</th>
//             <th className="border-b border-r border-gray-200 bg-gray-50 px-4 py-2">Name</th>
//             <th className="border-b border-gray-200 bg-gray-50 px-4 py-2">Email</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row) => (
//             <tr key={row.user_id} className="hover:bg-gray-100">
//               <td className="border-b border-r border-gray-200 px-4 py-2">{row.user_id}</td>
//               <td className="border-b border-r border-gray-200 px-4 py-2">{row.username}</td>
//               <td className="border-b border-r border-gray-200 px-4 py-2">{row.full_name}</td>
//               <td className="border-b border-gray-200 px-4 py-2">{row.email}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

//■■ Normal React Example ■■
// 'use client';

// import { useState, useEffect } from 'react';

// export const MemberList = () => {
//   const [rows, setRows] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         const response = await fetch('http://example.com/api/users');
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         setRows(data);
//         setIsLoading(false);
//       } catch (e) {
//         setError(e.message);
//         setIsLoading(false);
//       }
//     };

//     fetchMembers();
//   }, []);

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="container mx-auto max-w-4xl p-4">
//       <div className="mb-4 text-xl font-bold">From Members Table (Fetched from API)</div>
//       <div>This is now a client component.</div>
//       <table className="min-w-full border border-gray-200 bg-white">
//         <thead>
//           <tr>
//             <th className="border-b border-r border-gray-200 bg-gray-50 px-4 py-2">User Id</th>
//             <th className="border-b border-r border-gray-200 bg-gray-50 px-4 py-2">User name</th>
//             <th className="border-b border-r border-gray-200 bg-gray-50 px-4 py-2">Name</th>
//             <th className="border-b border-gray-200 bg-gray-50 px-4 py-2">Email</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row) => (
//             <tr key={row.user_id} className="hover:bg-gray-100">
//               <td className="border-b border-r border-gray-200 px-4 py-2">{row.user_id}</td>
//               <td className="border-b border-r border-gray-200 px-4 py-2">{row.username}</td>
//               <td className="border-b border-r border-gray-200 px-4 py-2">{row.full_name}</td>
//               <td className="border-b border-gray-200 px-4 py-2">{row.email}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };
