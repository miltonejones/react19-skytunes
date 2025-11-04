import React, { Suspense, useMemo } from "react";
import { getAlbumGrid } from "../../connector";
import TrackGrid from "../TrackGrid/TrackGrid";
import { useNavigate, useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";

const AlbumGrid = ({}) => {
  const { page } = useParams();
  const navigate = useNavigate();

  const { data } = useSuspenseQuery({
    queryKey: ["artists", page],
    queryFn: () => getAlbumGrid(page),
  });

  const handleClick = (id) => {
    navigate(`/album/detail/${id}`);
  };

  const handlePageChange = (pg) => navigate(`/album/grid/${pg}`);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrackGrid
        key={page || 1}
        page={page}
        count={data.count}
        handlePageChange={handlePageChange}
        items={data.records.filter((rec) => rec.TrackCount > 0)}
        handleClick={handleClick}
      />
    </Suspense>
  );
};

export default AlbumGrid;
