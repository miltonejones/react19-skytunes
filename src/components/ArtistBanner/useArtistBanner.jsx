import React from "react";
import { getArtistDetail } from "../../connector";
function useArtistBanner(rowData, labelName) {
  const [bannerProps, setBannerProps] = React.useState({});

  const getArtistData = React.useCallback(
    async function (artistId) {
      const artistData = await getArtistDetail(artistId);
      const [artistItem] = artistData.row;
      setBannerProps({
        labelName,
        titleName:
          rowData.row[0].Name || rowData.row[0].Title || rowData.row[0].Genre,
        trackCount: rowData.related.count,
        artistItem,
      });
    },
    [bannerProps]
  );

  React.useEffect(() => {
    if (!rowData?.row) return;

    const records = rowData.records || rowData.related.records;

    const artistItem = records.find((item) => !!item.artistFk);
    if (artistItem) {
      getArtistData(artistItem.artistFk);
    }
  }, [rowData]);

  return { bannerProps };
}
export default useArtistBanner;
