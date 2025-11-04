import React from "react";
import { getAlbumDetail } from "../../connector";
import { useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";
import TrackList from "../TrackList/TrackList";
import useArtistBanner from "../ArtistBanner/useArtistBanner";

const AlbumDetail = ({ onSongSelect, currentSongId, onSongInsert }) => {
  const { id } = useParams();
  const { data, refetch } = useSuspenseQuery({
    queryKey: ["album", id],
    queryFn: () => getAlbumDetail(id),
  });

  const { bannerProps } = useArtistBanner(data, "Album");

  const handlePageChange = (pg) => navigate(`/album/detail/${id}/${pg}`);

  return (
    <TrackList
      currentSongId={currentSongId}
      records={sortAndDeduplicateTracks(data.related.records)}
      count={data.related.count}
      handlePageChange={handlePageChange}
      onSongSelect={onSongSelect}
      onSongInsert={onSongInsert}
      showTrackNumbers={true}
      page={1}
      groupByDisc={true}
      onUpdate={refetch}
      {...bannerProps}
    />
  );
};

export default AlbumDetail;

function sortAndDeduplicateTracks(tracks) {
  // Create a Set to track seen track numbers per disc
  const seenTracks = new Set();
  const uniqueTracks = [];

  // Sort tracks by disc number and track number first
  const sortedTracks = tracks.sort((a, b) => {
    const discA = a.discNumber || 0;
    const discB = b.discNumber || 0;
    const trackA = a.trackNumber || 0;
    const trackB = b.trackNumber || 0;

    // First sort by disc number, then by track number
    if (discA !== discB) {
      return discA - discB;
    }
    return trackA - trackB;
  });

  // Filter out duplicates (keep first occurrence)
  for (const track of sortedTracks) {
    const discNum = track.discNumber || 0;
    const trackNum = track.trackNumber || 0;

    // Create a unique key for disc + track number combination
    const trackKey = `${discNum}-${trackNum}`;

    // Only add if we haven't seen this track number on this disc before
    if (!seenTracks.has(trackKey)) {
      seenTracks.add(trackKey);
      uniqueTracks.push(track);
    }
  }

  return uniqueTracks;
}
