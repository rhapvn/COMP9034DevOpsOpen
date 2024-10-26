import { getInstitutes, getLabs, getResearchCentres } from "@/db/apiRoutes";
import { placeTagEnum } from "@/db/schema";
import { Institute, Laboratory, PlaceTag, ResearchCentre } from "src/types";
import { useEffect, useState } from "react";

export const usePlaceNames = (placeTag: PlaceTag) => {
  const [placeNames, setPlaceNames] = useState<Institute[] | ResearchCentre[] | Laboratory[]>([]);

  useEffect(() => {
    const fetchPlaceNames = async () => {
      let result;
      switch (placeTag) {
        case placeTagEnum.enumValues[0]:
          result = await getInstitutes();
          break;
        case placeTagEnum.enumValues[1]:
          result = await getResearchCentres();
          break;
        case placeTagEnum.enumValues[2]:
          result = await getLabs();
          break;
        default:
          return;
      }
      if (result && result.success) {
        setPlaceNames(result.data);
      }
    };

    fetchPlaceNames();
  }, [placeTag]);
  return placeNames;
};
