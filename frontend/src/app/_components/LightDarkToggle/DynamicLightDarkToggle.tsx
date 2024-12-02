"use client"
import dynamic from "next/dynamic";

const DynamicLightDarkToggle = dynamic(() => import('./LightDarkToggle'), {
  ssr: false // This ensures the component is not SSR'd
});

export default DynamicLightDarkToggle;