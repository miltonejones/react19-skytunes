import { Suspense, use, useEffect, useState } from "react";
import Card from "../Card/Card";
import {
  getArtistDetail,
  getDashboard,
  getPlaylistGrid,
} from "../../connector";
import { useNavigate } from "react-router-dom";
import HorizCard from "../HorizCard/HorizCard";
import ArtistBanner from "../ArtistBanner/ArtistBanner";
import Spinner from "../Spinner/Spinner";
import ArtistCarousel from "../ArtistCarousel/ArtistCarousel";
import Banner from "../Banner/Banner";

function Message({ messagePromise, messageType, bannerProps, setBannerProps }) {
  const navigate = useNavigate();
  const data = use(messagePromise);

  useEffect(() => {
    if (messageType !== "artist" || bannerProps.artists) {
      return;
    }

    // Filter artists that have imageLg property
    const artistsWithImages = data
      .filter(
        (item) =>
          item.Type === "artist" && item.imageLg && item.imageLg !== "no image"
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 15); // Shuffle for variety

    if (artistsWithImages.length > 0) {
      setBannerProps &&
        setBannerProps({
          artists: artistsWithImages,
        });
    }
  }, [data, messageType]);

  // Filter by type and get 12 random items
  const filteredItems = data.filter((f) => f.Type === messageType);
  const items = filteredItems
    .sort(() => Math.random() - 0.5) // Shuffle the array
    .slice(0, 12); // Take first 12 after shuffling

  const handleClick = (type, id) => {
    navigate(`/${type}/detail/${id}`);
  };

  return (
    <>
      <div className="row-6">
        {items.map((datum) => (
          <Card
            key={datum.ID}
            image={datum.Thumbnail}
            title={datum.Name}
            caption={datum.Caption}
            onClick={() => handleClick(messageType, datum.ID)}
          />
        ))}
      </div>
    </>
  );
}

function PlaylistDash({ messagePromise }) {
  const navigate = useNavigate();
  const data = use(messagePromise);

  if (!data.records || data.records.length === 0) {
    return <>No playlists to display</>;
  }

  const items = data.records
    .sort(() => Math.random() - 0.5) // Shuffle the array
    .slice(0, 8); // Take first 12 after shuffling

  const handleClick = (id) => {
    navigate(`/playlist/detail/${id}`);
  };

  return (
    <>
      <div className="row-4">
        {items.map((datum) => (
          <HorizCard
            half
            key={datum.ID}
            src={datum.image}
            title={datum.Title}
            caption={datum.TrackCount + " Tracks"}
            onCardClick={() =>
              handleClick(
                datum.listKey ||
                  datum.Title.replace(/[\s\&\-]/g, "").toLowerCase()
              )
            }
          />
        ))}
      </div>
    </>
  );
}

export default function Dash() {
  const [bannerProps, setBannerProps] = useState({});
  const messagePromise = getDashboard();
  const playlistPromise = getPlaylistGrid(); // Unused in current code
  return (
    <>
      {/* {bannerProps.labelName && <ArtistBanner {...bannerProps} />} */}

      {bannerProps.artists && <ArtistCarousel {...bannerProps} />}

      <Suspense fallback={<Spinner />}>
        <Banner title="Featured Playlists" link="/playlist" icon="📜" />
        <PlaylistDash messagePromise={playlistPromise} />
      </Suspense>
      <Suspense fallback={<Spinner />}>
        <Banner title="Featured Albums" link="/album" icon="📀" />
        <Message messagePromise={messagePromise} messageType="album" />
        <Banner title="Featured Artists" link="/artist" icon="🤺" />
        <Message
          messagePromise={messagePromise}
          messageType="artist"
          bannerProps={bannerProps}
          setBannerProps={setBannerProps}
        />
      </Suspense>
    </>
  );
}
