import "./doctor-talk.css";

const videos = [
  {
    title: "Care-N-Cure doctor talk on YouTube",
    embed: "https://www.youtube-nocookie.com/embed/knsvt2-xQjE?start=22&rel=0",
    url: "https://www.youtube.com/watch?v=knsvt2-xQjE&t=22s",
    platform: "YouTube",
  },
  {
    title: "Care-N-Cure doctor talk with Jiyo Bangla on Facebook",
    embed: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent("https://www.facebook.com/JiyoBangla/videos/964193387879613/")}&show_text=false&width=500&height=281`,
    url: "https://www.facebook.com/JiyoBangla/videos/964193387879613/?t=0",
    platform: "Facebook",
  },
];

export default function DoctorTalk() {
  return (
    <section className="medi-doctor-talk" aria-labelledby="medi-doctor-talk-title">
      <div className=  "container-xxl  medi-doctor-talk-container">
        <h2 id="medi-doctor-talk-title">Care-N-Cure Doctor Talk</h2>
        <p className="medi-doctor-talk-intro">
          Hear from Dr. Ghosh and Dr. Haldar about how we treat our patients. No complex medical terms, just straight talk about your health.
        </p>
        <div className="medi-doctor-talk-grid">
          {videos.map((video) => (
            <div className="medi-doctor-talk-item" key={video.platform}>
              <div className="ratio ratio-16x9 medi-doctor-talk-player">
                <iframe
                  src={video.embed}
                  title={video.title}
                  width="500"
                  height="281"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              {/* <a className="medi-doctor-talk-source" href={video.url} target="_blank" rel="noopener noreferrer">
                Watch on {video.platform}<span className="visually-hidden"> (opens in a new tab)</span>
              </a> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
