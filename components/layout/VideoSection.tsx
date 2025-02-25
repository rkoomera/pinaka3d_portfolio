"use client";

import { useState } from 'react';

export function VideoSection() {
  const [showVideoPopup, setShowVideoPopup] = useState(false);

  return (
    <section className="relative w-full h-screen bg-black">
      <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted>
        <source src="https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-videos//demo-reel-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          className="bg-white text-black p-4 rounded-full shadow-lg"
          onClick={() => setShowVideoPopup(true)}
        >
          Play Video
        </button>
      </div>

      {showVideoPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <button
              className="absolute top-2 right-2 text-black"
              onClick={() => setShowVideoPopup(false)}
            >
              Close
            </button>
            <video controls autoPlay className="w-full h-auto">
              <source src="https://gyuznawtihohzzdmhvtw.supabase.co/storage/v1/object/public/project-videos//demo-reel-bg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>
  );
} 