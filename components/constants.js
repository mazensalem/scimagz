import dynamic from "next/dynamic";

const Embed = dynamic(
  () => {
    return import("@editorjs/embed");
  },
  { ssr: false }
);
const Table = dynamic(
  () => {
    return import("@editorjs/table");
  },
  { ssr: false }
);
const List = dynamic(
  () => {
    return import("@editorjs/list");
  },
  { ssr: false }
);
const Warning = dynamic(
  () => {
    return import("@editorjs/warning");
  },
  { ssr: false }
);
const Code = dynamic(
  () => {
    return import("@editorjs/code");
  },
  { ssr: false }
);
const LinkTool = dynamic(
  () => {
    return import("@editorjs/link");
  },
  { ssr: false }
);
const Image = dynamic(
  () => {
    return import("@editorjs/image");
  },
  { ssr: false }
);
const Raw = dynamic(
  () => {
    return import("@editorjs/raw");
  },
  { ssr: false }
);
const Header = dynamic(
  () => {
    return import("@editorjs/header");
  },
  { ssr: false }
);
const Quote = dynamic(
  () => {
    return import("@editorjs/quote");
  },
  { ssr: false }
);
const Marker = dynamic(
  () => {
    return import("@editorjs/marker");
  },
  { ssr: false }
);
const CheckList = dynamic(
  () => {
    return import("@editorjs/checklist");
  },
  { ssr: false }
);
const Delimiter = dynamic(
  () => {
    return import("@editorjs/delimiter");
  },
  { ssr: false }
);
const InlineCode = dynamic(
  () => {
    return import("@editorjs/inline-code");
  },
  { ssr: false }
);
const SimpleImage = dynamic(
  () => {
    return import("@editorjs/simple-image");
  },
  { ssr: false }
);

export const EDITOR_JS_TOOLS = {
  embed: Embed,
  table: Table,
  marker: Marker,
  list: List,
  warning: Warning,
  code: Code,
  linkTool: LinkTool,
  image: Image,
  raw: Raw,
  header: Header,
  quote: Quote,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
};
