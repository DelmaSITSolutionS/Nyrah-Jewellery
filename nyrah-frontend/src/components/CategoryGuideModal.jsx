import React, { useEffect } from "react";

export default function CategoryGuideModal({ category, onClose }) {
  const guides = {
    ring: "https://drive.google.com/file/d/1S8--_D6MfW5IQnIA69BpudoabzFdJt1b/view?usp=sharing",
    bracelet: "https://drive.google.com/file/d/1kQpHpqS2rTNE_MfaQNEAueNDWz4haRC7/view?usp=sharing",
    bangle: "https://drive.google.com/file/d/1eTpiGse6prGWN0I6d_EU6otn16yNGoBt/view?usp=sharing",
    // Add more categories as needed
  };

  const guideUrl = guides[category?.toLowerCase()];
  if (!guideUrl) return null;

  // Open guide in a new tab as soon as the component renders
  useEffect(() => {
    window.open(guideUrl, "_blank", "noopener,noreferrer");
    onClose(); // Close the modal after opening the guide
  }, [guideUrl, onClose]);

  return null; // No UI is needed anymore
}
