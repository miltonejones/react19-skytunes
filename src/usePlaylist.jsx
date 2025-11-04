import { useSuspenseQuery } from "@tanstack/react-query";
import { getPlaylistGrid, savePlaylist } from "./connector";
import { useEffect, useState } from "react";

const createKey = (name) => name.replace(/[\s&-]/g, "").toLowerCase();

export default function usePlaylist() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [related, setRelated] = useState([]);
  const [listItems, setListItems] = useState([]);

  const extractRelated = (data) => {
    const relatedPlaylists = [];
    if (!data || !data.records) return relatedPlaylists;
    data.records.forEach((item) => {
      if (item.related && Array.isArray(item.related)) {
        relatedPlaylists.push(...item.related);
      }
    });
    return relatedPlaylists;
  };

  const { data, refetch } = useSuspenseQuery({
    queryKey: ["listslib"],
    queryFn: () => getPlaylistGrid(1),
  });

  useEffect(() => {
    if (data) {
      const related = extractRelated(data);
      setRelated(related);
      setListItems(data.records || []);
    }
  }, [data]);

  const matchTrack = (track) => {
    return {
      ...track,
      favorite: related.includes(track?.FileKey) ? true : false,
    };
  };

  const matchList = (list, track) => {
    return list.related && list.related.includes(track?.FileKey) ? true : false;
  };

  const createList = async () => {
    const listname = prompt("Enter new playlist name:");
    if (!listname) return;

    const playlist = {
      Title: listname,
      listKey: createKey(listname),
      image: currentTrack.albumImage,
      related: [currentTrack.FileKey],
    };
    await savePlaylist(playlist);
    refetch();
    setDrawerOpen(false);
  };

  const updateList = async (playlist) => {
    const { related } = playlist;
    const updated = {
      ...playlist,
      related:
        related.indexOf(currentTrack.FileKey) > -1
          ? related.filter((f) => f !== currentTrack.FileKey)
          : related.concat(currentTrack.FileKey),
    };
    await savePlaylist(updated);
    refetch();
    setDrawerOpen(false);
  };

  const openDrawer = (track) => {
    setCurrentTrack(track);
    setDrawerOpen(true);
  };

  return {
    matchTrack,
    listItems,
    enabled: !!listItems.length,
    drawerOpen,
    setDrawerOpen,
    openDrawer,
    currentTrack,
    matchList,
    updateList,
    createList,
  };
}
