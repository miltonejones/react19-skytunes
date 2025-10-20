import React from "react";
import { getPlaylistDetail, savePlaylist } from "../../connector";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import TrackList from "../TrackList/TrackList";
import useArtistBanner from "../ArtistBanner/useArtistBanner";

const PlaylistDetail = ({ currentSongId, onSongSelect }) => {
  const { id } = useParams();

  const { data, refetch, isFetching } = useSuspenseQuery({
    queryKey: ["listdetail", id],
    queryFn: () => getPlaylistDetail(id),
  });

  const handlePageChange = (pg) => navigate(`/playlist/detail/${id}/${pg}`);

  const handleReorder = async (newRecords, fromIndex, toIndex) => {
    const related = newRecords.map((record) => record.FileKey);
    const [playlist] = data.row;
    const updated = {
      ...playlist,
      items: null,
      track: null,
      related,
    };
    const res = await savePlaylist(updated);
    refetch();
  };

  const { bannerProps } = useArtistBanner(data, "Playlist");

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <TrackList
      currentSongId={currentSongId}
      records={data.related.records}
      count={data.related.count}
      handlePageChange={handlePageChange}
      onSongSelect={onSongSelect}
      allowDrag={true}
      onReorder={handleReorder}
      page={1}
      onUpdate={refetch}
      hidePaginator
      {...bannerProps}
    />
  );
};

export default PlaylistDetail;
