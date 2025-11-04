import React from "react";
import { getPlaylistDetail, savePlaylist } from "../../connector";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import TrackList from "../TrackList/TrackList";
import useArtistBanner from "../ArtistBanner/useArtistBanner";

const PlaylistDetail = ({ currentSongId, onSongSelect, onSongInsert }) => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    await savePlaylist(updated);
    refetch();
  };
  const setPhoto = async (song) => {
    const [playlist] = data.row;
    const ok = confirm(
      `Set playlist ${playlist.Title} image to the album art from "${song.Title}"?`
    );
    if (!ok) return;
    const updated = {
      ...playlist,
      image: song.albumImage,
      items: null,
      track: null,
    };
    await savePlaylist(updated);
    // refetch();
    navigate(`/playlist`);
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
      onSongInsert={onSongInsert}
      allowDrag={true}
      onReorder={handleReorder}
      page={1}
      onUpdate={refetch}
      hidePaginator
      setPhoto={setPhoto}
      {...bannerProps}
    />
  );
};

export default PlaylistDetail;
