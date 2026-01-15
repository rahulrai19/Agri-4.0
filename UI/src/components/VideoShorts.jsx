import React, { useState } from 'react';
import { Play, X } from 'lucide-react';

// Sample data for shorts - replacing with actual farming related content placeholders if possible
const SHORTS_DATA = [
    {
        id: 1,
        title: "Modern Farming Technique",
        thumbnail: "https://i.ytimg.com/vi/iZADNmr-3Ro/hq720.jpg",
        videoUrl: "https://www.youtube.com/shorts/iZADNmr-3Ro",
        views: "1.5M",
        videoId: "iZADNmr-3Ro"
    },
    {
        id: 2,
        title: "Smart Agriculture Tip",
        thumbnail: "https://i.ytimg.com/vi/z_wJ_9Pvakc/hq720.jpg",
        videoUrl: "https://www.youtube.com/shorts/z_wJ_9Pvakc",
        views: "890k",
        videoId: "z_wJ_9Pvakc"
    },
    {
        id: 3,
        title: "Crop Yield Hack",
        thumbnail: "https://i.ytimg.com/vi/2clqFFcRjuY/hq720.jpg",
        videoUrl: "https://www.youtube.com/shorts/2clqFFcRjuY",
        views: "2.3M",
        videoId: "2clqFFcRjuY"
    },
    {
        id: 4,
        title: "Daily Farm Insight",
        thumbnail: "https://i.ytimg.com/vi/pfBz4zebym4/hq720.jpg",
        videoUrl: "https://www.youtube.com/shorts/pfBz4zebym4",
        views: "540k",
        videoId: "pfBz4zebym4"
    }
];

const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

// Start: Fix for Shorts URL extraction (since regex above is for standard)
const getShortsId = (url) => {
    if (url.includes('/shorts/')) {
        return url.split('/shorts/')[1].split('?')[0];
    }
    return getYouTubeId(url);
}

export const VideoShorts = () => {
    const [playingVideo, setPlayingVideo] = useState(null);

    return (
        <div className="space-y-4 py-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold text-gray-900">Agri Shorts 🎥</h2>
                <button className="text-sm text-green-600 font-semibold">View All</button>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar px-1">
                {SHORTS_DATA.map((video) => (
                    <div
                        key={video.id}
                        onClick={() => setPlayingVideo(video)}
                        className="relative flex-shrink-0 w-36 h-60 rounded-2xl overflow-hidden cursor-pointer group shadow-md snap-start bg-gray-100"
                    >
                        {/* Thumbnail */}
                        <img
                            src={video.thumbnail.includes('unsplash') ? video.thumbnail : `https://i.ytimg.com/vi/${video.videoId}/hq720.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=600&fit=crop'}
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                        {/* Play Icon */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-6 h-6 text-white fill-current" />
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 w-full p-3 text-white">
                            <h3 className="text-sm font-bold leading-tight line-clamp-2 drop-shadow-md">{video.title}</h3>
                            <p className="text-[10px] text-gray-200 mt-1 flex items-center gap-1">
                                👁️ {video.views}
                            </p>
                            <div className="mt-1">
                                <span className="p-0.5 bg-red-600 rounded text-[8px] font-bold px-1">YouTube</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Player Modal */}
            {playingVideo && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="relative w-full max-w-sm h-[80vh] bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                        {/* Header */}
                        <div className="absolute top-0 w-full p-4 z-10 flex justify-end">
                            <button
                                onClick={() => setPlayingVideo(null)}
                                className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* YouTube Iframe */}
                        <div className="flex-1 bg-black">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${playingVideo.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&shorts=1`}
                                title={playingVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Footer Info */}
                        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
                            <h2 className="text-white text-lg font-bold">{playingVideo.title}</h2>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
