import { generateSignature } from "../utils/generateSignature";

export function ImageUpload({ setContent, content, postid }) {
  async function handleWidgetClick() {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dc1fhdtwe",
        uploadSignature: generateSignature,
        api_key: "521835868598139",
        resourceType: "raw",
        uploadPreset: "scimagz",
        sources: ["local", "google_drive", "url"],
        multiple: false,
        clientAllowedFormats: ["pdf", "doc"],
        theme: "minimal",
        autoMinimize: false,
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          setContent({
            url: result.info.secure_url,
            public_id: result.info.public_id,
          });
          const r = await fetch("/api/sendpost", {
            method: "POST",
            body: JSON.stringify({
              sector: "Image",
              url: result.info.secure_url,
              public_id: result.info.public_id,
              postid,
            }),
          }).then((x) => x.json());
          if (r.content == "Done") {
            console.log("Done");
          }
        } else if (error) {
          console.log(error);
          alert("Error");
        }
      }
    );
    widget.open();
  }

  return (
    <div>
      <div>
        <button type="button" onClick={handleWidgetClick}>
          Upload file
        </button>
        <object data={content.url} type="application/pdf" />
      </div>
    </div>
  );
}
