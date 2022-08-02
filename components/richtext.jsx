import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import Checklist from "@editorjs/checklist";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import { StyleInlineTool } from "editorjs-style";
import Tooltip from "editorjs-tooltip";
import _ from "lodash/debounce";

const EDITTOR_HOLDER_ID = "editorjs";

const firstrender = true;

const CustomEditor = (props) => {
  const { setContent, content } = props;

  const isInstance = useRef();

  useEffect(() => {
    if (!isInstance.current) {
      if (firstrender) {
        initEditor();
        firstrender = false;
      }
    }
    return () => {
      if (firstrender) {
        if (isInstance.current) {
          isInstance.current.destroy();
          isInstance.current = null;
        }
      }
    };
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: EDITTOR_HOLDER_ID,
      data: JSON.parse(content),
      onReady: () => {
        isInstance.current = editor;
      },
      onChange: function () {
        try {
          contents();
        } catch (err) {}
      },
      //   autofocus: true,
      tools: {
        style: StyleInlineTool,
        tooltip: {
          class: Tooltip,
          config: {
            location: "left",
            highlightColor: "#FFEFD5",
            underline: true,
            backgroundColor: "#154360",
            textColor: "#FDFEFE",
            holder: "editorId",
          },
        },

        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            defaultLevel: 1,
          },
        },

        linkTool: LinkTool,

        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: "CMD+SHIFT+O",
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
        },
      },
    });
    async function contents() {
      const output = await editor.save();
      setContent(JSON.stringify({ blocks: output.blocks }));
    }
  };

  return (
    <>
      <div id={EDITTOR_HOLDER_ID}> </div>
    </>
  );
};

export default CustomEditor;
