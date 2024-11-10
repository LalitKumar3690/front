import { useCallback, useEffect, useState, useRef } from "react";

import Terminal from "./Terminal";
import FileTree from "./Tree";
import socket from "../socket";
import Editor from "@monaco-editor/react";
import AdjustableHeightBox from "./AdjustableHeightBox";

import { getFileMode } from "../utils/getFileMode";

function NextPage() {
  const [fileTree, setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [code, setCode] = useState("");

  console.log(selectedFileContent); 
  const isSaved = selectedFileContent === code;

  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    // console.log(monaco);
  }

  // function showValue() {
  //   alert(editorRef.current.getValue());
  // }

  useEffect(() => {
    if (!isSaved && code) {
      const timer = setTimeout(() => {
        socket.emit("file:change", {
          path: selectedFile,
          content: code,
        });
      }, 5 * 1000);

      console.log(selectedFile)
      return () => {
        clearTimeout(timer);
      };
    }
  }, [code, selectedFile, isSaved]);

 

  useEffect(() => {
    setCode(selectedFileContent);
  }, [selectedFileContent]);

  const getFileTree = async () => {
    const response = await fetch("http://localhost:9000/files");
    const result = await response.json();
    setFileTree(result.tree);
  };

  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;
    const response = await fetch(
      `http://localhost:9000/files/content?path=${selectedFile}`
    );
    const result = await response.json();
    setSelectedFileContent(result.content);
  }, [selectedFile]);

  useEffect(() => {
    if (selectedFile) getFileContents();
  }, [getFileContents, selectedFile]);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);
    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, []);
  console.log(fileTree);

  return (
    <div className="w-full h-screen flex justify-center  ">
      <div className="2xl:max-w-[120em] w-full h-full flex flex-col">
        <div className="flex w-full h-2/3 justify-center gap-1 p-4 ">
          <div className="w-[20%] border-r-2">
            <FileTree
              onSelect={(path) => {
                setSelectedFileContent("");
                setSelectedFile(path);
              }}
              tree={fileTree}
            />
          </div>
          <div className="w-[80%]">
          {selectedFile && (
            <p>
              {selectedFile.replaceAll("/", " > ")}{" "}
              {isSaved ? "Saved" : "Unsaved"}
            </p>
          )}
            <Editor
              height="90vh"
              defaultLanguage="javascript"
              defaultValue="// some comment"
              
              value={code}
              onChange={(value) => setCode(value)}
          
            />
            
          </div>
        </div>
        {/* <AdjustableHeightBox/> */}
        <div className="w-full " >
          <Terminal />
        </div>
      </div>
    </div>
    // <div className="playground-container">
    //   <div className="editor-container">
    //     <div className="files">
    //       <FileTree
    //         onSelect={(path) => {
    //           setSelectedFileContent("");
    //           setSelectedFile(path);
    //         }}
    //         tree={fileTree}
    //       />
    //     </div>
    //     <div className="editor">
    //       {selectedFile && (
    //         <p>
    //           {selectedFile.replaceAll("/", " > ")}{" "}
    //           {isSaved ? "Saved" : "Unsaved"}
    //         </p>
    //       )}
    //        {/* <button onClick={showValue}>Show value</button> */}
    //   <Editor
    //     height="90vh"
    //     defaultLanguage="javascript"
    //     defaultValue="// some comment"
    //     onMount={handleEditorDidMount}
    //   />
    //     </div>
    //   </div>
    //   <div className="terminal-container">
    //     <Terminal />
    //   </div>
    // </div>
  );
}

export default NextPage;
