export default function Textreader({ content }) {
  return (
    <div>
      {content.blocks.map((value) => {
        const d = new Date();
        const n = d.getTime();
        if (value.type === "paragraph") {
          return <p key={n}>{value.data.text}</p>;
        } else if (value.type === "header") {
          if (value.data.level == 1) {
            return <h1 key={n}>{value.data.text}</h1>;
          } else if (value.data.level == 2) {
            return <h2 key={n}>{value.data.text}</h2>;
          } else if (value.data.level == 3) {
            return <h3 key={n}>{value.data.text}</h3>;
          } else if (value.data.level == 4) {
            return <h4 key={n}>{value.data.text}</h4>;
          } else if (value.data.level == 5) {
            return <h5 key={n}>{value.data.text}</h5>;
          } else if (value.data.level == 6) {
            return <h6 key={n}>{value.data.text}</h6>;
          }
        } else if (value.type === "checklist") {
          return (
            <>
              {value.data.items.map((item) => (
                <>
                  <input key={n} type="checkbox" checked={item.checked} />
                  {item.text}
                </>
              ))}
            </>
          );
        } else if (value.type === "list") {
          return (
            <>
              {value.data.style == "unordered" ? (
                <ul key={n}>
                  {value.data.items.map((item) => (
                    <li key={n}>{item}</li>
                  ))}
                </ul>
              ) : (
                <ol key={n}>
                  {value.data.items.map((item) => (
                    <li key={n}>{item}</li>
                  ))}
                </ol>
              )}
            </>
          );
        } else if (value.type === "quote") {
          return <quote key={n}>{value.data.text} </quote>;
        } else if (value.type === "embed") {
          return (
            <iframe
              key={n}
              src={value.data.embed}
              width={value.data.width}
              height={value.data.height}
            ></iframe>
          );
        }
      })}
    </div>
  );
}
