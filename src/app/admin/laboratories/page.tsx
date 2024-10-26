import { DataTable } from "@/components/DataTable";
import { LabColumns } from "@/components/tableParts/columns/LabColumns";
import TitleLine from "@/components/TitleLine";
import { getLabs } from "@/db/apiRoutes";

const LaboratoriesPage = async () => {
  const data = { columns: LabColumns, data: (await getLabs()).data };
  return (
    <div className="mx-4">
      <TitleLine name="Laboratories" />
      <div className="container mx-auto py-10">
        <DataTable {...data} />
      </div>
    </div>
  );
};

export default LaboratoriesPage;
