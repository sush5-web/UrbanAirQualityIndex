import React from "react";
import Draggable from "react-draggable";

const SearchBox = ({ onPlaceSelected }) => {
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (!window.google || !window.google.maps) return;
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = place.geometry.location;
        onPlaceSelected({
          lat: location.lat(),
          lng: location.lng(),
          name: place.formatted_address,
        });
      }
    });
  }, [onPlaceSelected]);

  return (
    <Draggable>
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          cursor: "move",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a city..."
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "300px",
          }}
        />
      </div>
    </Draggable>
  );
};

export default SearchBox;
