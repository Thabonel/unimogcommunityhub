
interface VideoUploadProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
}

const VideoUpload = ({ videoUrl, setVideoUrl }: VideoUploadProps) => {
  return (
    <div>
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Video URL (YouTube, Vimeo, etc.)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
    </div>
  );
};

export default VideoUpload;
