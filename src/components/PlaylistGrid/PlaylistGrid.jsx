import React, { Suspense, useMemo } from "react";
import TrackGrid from "../TrackGrid/TrackGrid";
import { useNavigate, useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getPlaylistGrid } from "../../connector";

const PlaylistGrid = () => {
  const { page } = useParams();
  const navigate = useNavigate();

  const { data } = useSuspenseQuery({
    queryKey: ["lists", page],
    queryFn: () => getPlaylistGrid(page),
  });

  if (!data.records || data.records.length === 0) {
    return <>No playlists to display</>;
  }

  const handleClick = (id) => {
    navigate(`/playlist/detail/${id}`);
  };

  const handlePageChange = (pg) => navigate(`/playlists/grid/${pg}`);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TrackGrid
        key={page || 1}
        page={page}
        count={data.count}
        handlePageChange={handlePageChange}
        items={data.records.map((rec) => ({
          ...rec,
          ID: rec.listKey || rec.Title.replace(/\s+/, "").toLowerCase(),
        }))}
        handleClick={handleClick}
      />
    </Suspense>
  );
};

export default PlaylistGrid;
