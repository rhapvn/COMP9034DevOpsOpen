import TitleLine from "@/components/TitleLine";
import { getResearchCentres } from "@/db/apiRoutes";
import { DataTable } from "@/components/DataTable";
import { CentreColumns } from "@/components/tableParts/columns/CentreColumns";

const ResearchCentresPage = async () => {
  const data = { columns: CentreColumns, data: (await getResearchCentres()).data };
  return (
    <div className="mx-4">
      <TitleLine name="Research Centres" />
      <div className="container mx-auto py-10">
        <DataTable {...data} />
      </div>
    </div>
  );
};

export default ResearchCentresPage;
