import { useState } from "react";
import { UsersTable } from "@/components/tables/UsersTable";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/user.services";

const DataTables = () => {
  const [queryParams, setQueryParams] = useState({
    skip: 0,
    take: 10,
    role: "",
    department_id: "",
    is_active: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const {
    isFetching,
    data: userData,
  } = useQuery({
    queryKey: ["usersList", queryParams],
    queryFn: () => getUsers({
      ...queryParams,
      department_id: queryParams.department_id ? parseInt(queryParams.department_id) : undefined,
      is_active: queryParams.is_active === "true" ? true : queryParams.is_active === "false" ? false : undefined,
      role: queryParams.role || undefined
    }),
    refetchOnWindowFocus: false,
  });

  // Local filtering based on search term for immediate feedback
  const filteredUsers = (userData?.data?.list || []).filter(
    (user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Data Tables</h1>
        <p className="text-muted-foreground">
          Manage and view your data with advanced table features
        </p>
      </div>

      {/* Main Table Card */}
      <UsersTable 
        users={filteredUsers} 
        totalCount={userData?.data?.count || 0}
        loading={isFetching}
        queryParams={queryParams}
        setQueryParams={setQueryParams}
      />
    </div>
  );
};

export default DataTables;
