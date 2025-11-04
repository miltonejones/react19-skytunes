import React from "react";
import { getGenreDetail } from "../../connector";
import { useParams, useNavigate } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";
import TrackList from "../TrackList/TrackList";
import useArtistBanner from "../ArtistBanner/useArtistBanner";
// currentSongId={currentSongId}
const GenreDetail = ({ onSongSelect, currentSongId, onSongInsert }) => {
  const navigate = useNavigate();
  const { id, page } = useParams();

  const { data, refetch } = useSuspenseQuery({
    queryKey: ["genre", id, page],
    queryFn: () => getGenreDetail(id, page),
  });

  const handlePageChange = (pg) => navigate(`/genre/detail/${id}/${pg}`);

  const { bannerProps } = useArtistBanner(data, "Genre");

  return (
    <TrackList
      currentSongId={currentSongId}
      records={data.related.records}
      count={data.related.count}
      handlePageChange={handlePageChange}
      onSongSelect={onSongSelect}
      onSongInsert={onSongInsert}
      page={page || 1}
      onUpdate={refetch}
      {...bannerProps}
    />
  );
};

export default GenreDetail;
