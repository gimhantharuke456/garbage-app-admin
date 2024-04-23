import React from "react";

const Marker = ({
  className,
  lat,
  lng,
  markerId,
  onClick,
  draggable,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDrag,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDragEnd,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDragStart,

  ...props
}) =>
  lat && lng ? (
    <img
      className={className}
      src={`${"map-marker.png" ?? "/google-maps-react-markers"}/marker-pin${
        draggable ? "-draggable" : ""
      }.png`}
      // lat={lat}
      // lng={lng}
      onClick={(e) => (onClick ? onClick(e, { markerId, lat, lng }) : null)}
      style={{ fontSize: 40 }}
      alt={markerId}
      width={35}
      height={35}
      {...props}
    />
  ) : null;

export default Marker;
