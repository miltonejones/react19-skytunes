import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getGenreGrid } from "../../connector";
import TrackGrid from "../TrackGrid/TrackGrid";
import { useSuspenseQuery } from "@tanstack/react-query";

const GenreGrid = () => {
  const { page } = useParams();
  const navigate = useNavigate();

  const { data } = useSuspenseQuery({
    queryKey: ["genres", page],
    queryFn: () => getGenreGrid(page),
  });

  const handleClick = (id) => {
    navigate(`/genre/detail/${id}`);
  };

  const handlePageChange = (pg) => navigate(`/genre/grid/${pg}`);

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

export default GenreGrid;
