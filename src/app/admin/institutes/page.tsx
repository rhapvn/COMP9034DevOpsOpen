import TitleLine from "@/components/TitleLine";
import { DataTable } from "@/components/DataTable";
import { getInstitutes } from "@/db/apiRoutes";
import { InstituteColumns } from "@/components/tableParts/columns/InstituteColumns";

const InstitutesPage = async () => {
  const data = { columns: InstituteColumns, data: (await getInstitutes()).data };

  return (
    <div className="mx-4">
      <TitleLine name="Institutes" />
      <div className="container mx-auto py-10">
        <DataTable {...data} />
      </div>
    </div>
  );
};

export default InstitutesPage;
