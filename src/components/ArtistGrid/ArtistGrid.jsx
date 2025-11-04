import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArtistGrid } from "../../connector";
import TrackGrid from "../TrackGrid/TrackGrid";

const ArtistGrid = () => {
  const { page } = useParams();
  const navigate = useNavigate();

  const { data } = useSuspenseQuery({
    queryKey: ["artists", page],
    queryFn: () => getArtistGrid(page),
  });

  const handleClick = (id) => {
    navigate(`/artist/detail/${id}`);
  };

  const handlePageChange = (pg) => navigate(`/artist/grid/${pg}`);

  return (
    <div>
      <TrackGrid
        key={page || 1}
        page={page}
        count={data.count}
        handlePageChange={handlePageChange}
        items={data.records.filter((rec) => rec.TrackCount > 0)}
        handleClick={handleClick}
      />
    </div>
  );
};

export default ArtistGrid;
