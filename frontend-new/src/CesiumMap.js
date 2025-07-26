// src/CesiumMap.js
import { Viewer, Ion, Cartesian3 } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useEffect, useRef } from "react";

function CesiumMap({ coordinates }) {
  const viewerRef = useRef(null);

  // ✅ This line fails if VITE_CESIUM_TOKEN is not defined correctly
  Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;

  useEffect(() => {
    if (!coordinates || !viewerRef.current) return;

    const viewer = new Viewer(viewerRef.current, {
      terrainProvider: undefined,
    });

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        coordinates.lng,
        coordinates.lat,
        1500000
      ),
    });

    return () => viewer.destroy();
  }, [coordinates]);

  return <div ref={viewerRef} style={{ width: "100%", height: "500px" }} />;
}

export default CesiumMap;
