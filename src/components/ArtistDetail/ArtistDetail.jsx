import React from "react";
import { getArtistDetail } from "../../connector";
import { useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";
import TrackList from "../TrackList/TrackList";
import useArtistBanner from "../ArtistBanner/useArtistBanner";

const ArtistDetail = ({ onSongSelect, currentSongId, onSongInsert }) => {
  const { id } = useParams();

  const { data, refetch } = useSuspenseQuery({
    queryKey: ["artist", id],
    queryFn: () => getArtistDetail(id),
  });

  const { bannerProps } = useArtistBanner(data, "Artist");

  const handlePageChange = (pg) => navigate(`/artist/detail/${id}/${pg}`);

  return (
    <TrackList
      currentSongId={currentSongId}
      records={data.related.records}
      count={data.related.count}
      handlePageChange={handlePageChange}
      onSongSelect={onSongSelect}
      onSongInsert={onSongInsert}
      page={1}
      onUpdate={refetch}
      {...bannerProps}
    />
  );
};

export default ArtistDetail;
