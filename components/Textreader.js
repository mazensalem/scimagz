export default function Textreader({ content }) {
  return (
    <div>
      {" "}
      {content.blocks.map((value) => {
        if (value.type === "paragraph") {
          return <p>{value.data.text}</p>;
        } else if (value.type == "header") {
          if (value.data.level == 1) {
            return <h1>{value.data.text}</h1>;
          } else if (value.data.level == 2) {
            return <h2>{value.data.text}</h2>;
          } else if (value.data.level == 3) {
            return <h3>{value.data.text}</h3>;
          } else if (value.data.level == 4) {
            return <h4>{value.data.text}</h4>;
          } else if (value.data.level == 5) {
            return <h5>{value.data.text}</h5>;
          } else if (value.data.level == 6) {
            return <h6>{value.data.text}</h6>;
          }
        } else if (value.type == "checklist") {
          //   console.log();
          return (
            <>
              {value.data.items.map((item) => (
                <>
                  <input type="checkbox" checked={item.checked} />
                  {item.text}
                </>
              ))}
            </>
          );
        } else if (value.type == "list") {
          return (
            <>
              {value.data.style == "unordered" ? (
                <ul>
                  {value.data.items.map((item) => (
                    <li>{item}</li>
                  ))}
                </ul>
              ) : (
                <ol>
                  {value.data.items.map((item) => (
                    <li>{item}</li>
                  ))}
                </ol>
              )}
            </>
          );
        } else if (value.type == "quote") {
          return <quote>{value.data.text} </quote>;
        } else if (value.type == "embed") {
          return (
            <iframe
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
