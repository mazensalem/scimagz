import { generateSignature } from "../utils/generateSignature";
import { Button } from "react-bootstrap";

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
          console.log(r);
          if (r.content) {
            alert("Success");
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
        <Button
          variant="outline-success"
          type="button"
          className="ms-2"
          onClick={handleWidgetClick}
        >
          Upload file
        </Button>
        {content ? <object data={content.url} type="application/pdf" /> : null}
      </div>
    </div>
  );
}
