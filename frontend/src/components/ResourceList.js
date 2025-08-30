import React from "react";

export default function ResourceList({ resources }) {
  if (!resources) {
    return (
      <div className="mt-6 text-center text-gray-500">Loading resources...</div>
    );
  }

  const {
    youtube_videos = [],
    coursera_courses = [],
    github_repos = []
  } = resources;

  const empty =
    youtube_videos.length === 0 &&
    coursera_courses.length === 0 &&
    github_repos.length === 0;

  if (empty) {
    return (
      <div className="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded p-4">
        No resources found. Try a broader topic or a different keyword.
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-6">
      {youtube_videos.length > 0 && (
        <section className="bg-white rounded-lg shadow border border-gray-200">
          <header className="px-4 py-3 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>▶️</span> YouTube Videos
            </h3>
            <span className="text-xs bg-gray-100 border px-2 py-1 rounded text-gray-700">
              {youtube_videos.length} items
            </span>
          </header>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {youtube_videos.map((video) => (
              <article key={video.videoId} className="rounded overflow-hidden border">
                <div className="aspect-video bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-gray-800 line-clamp-2">{video.title}</h4>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm text-indigo-600 hover:underline"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {coursera_courses.length > 0 && (
        <section className="bg-white rounded-lg shadow border border-gray-200">
          <header className="px-4 py-3 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>🎓</span> Coursera Courses
            </h3>
            <span className="text-xs bg-gray-100 border px-2 py-1 rounded text-gray-700">
              {coursera_courses.length} items
            </span>
          </header>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {coursera_courses.map((course, index) => (
              <article key={index} className="border rounded p-4">
                <h4 className="font-semibold text-gray-800 mb-1">{course.title}</h4>
                <p className="text-sm text-gray-500 mb-2">Provider: Coursera</p>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-indigo-600 hover:underline"
                >
                  View on Coursera
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      {github_repos.length > 0 && (
        <section className="bg-white rounded-lg shadow border border-gray-200">
          <header className="px-4 py-3 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>💻</span> GitHub Repositories
            </h3>
            <span className="text-xs bg-gray-100 border px-2 py-1 rounded text-gray-700">
              {github_repos.length} items
            </span>
          </header>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {github_repos.map((repo, index) => (
              <article key={index} className="border rounded p-4">
                <h4 className="font-semibold text-gray-800 mb-1">{repo.repo}</h4>
                <p className="text-sm text-gray-500 mb-2">Open-source repository</p>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-indigo-600 hover:underline"
                >
                  View on GitHub
                </a>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
