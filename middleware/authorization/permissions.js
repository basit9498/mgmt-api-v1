/**
 * V1 permssion base
 */
const permssions = ["ADMIN", "CASHER", "TEACHER", "STUDENT"];

const permissions_v2 = [
  {
    role: "ADMIN",
    permssions: [
      {
        access_role: "COURSE",
        access_permissions: ["read", "edit", "delete", "share"],
      },
      {
        access_role: "TEACHER",
        access_permissions: ["read", "edit", "delete", "share"],
      },
      {
        access_role: "CASHER",
        access_permissions: ["read", "edit", "delete", "share"],
      },
      {
        access_role: "STUDENT",
        access_permissions: ["read", "edit", "delete", "share"],
      },
    ],
  },
];

module.exports = permssions;
