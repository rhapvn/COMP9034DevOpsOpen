import React from "react";
import { UserColumns } from "@/components/tableParts/columns/UserColumns";
import { getUsers } from "@/db/apiRoutes";
import TitleLine from "@/components/TitleLine";
import { DataTable } from "@/components/DataTable";
import { Suspense } from "react";
import Loading from "@/app/loading";

export default async function UserRolesPage() {
  const data = { columns: UserColumns, data: (await getUsers()).data };
  return (
    <div className="mx-4">
      <TitleLine name="User Roles" />
      
      <Suspense fallback={<Loading />}>
        <div className="container mx-auto py-10">
          <DataTable {...data} />
        </div>
      </Suspense> 
    </div>
  );
}
