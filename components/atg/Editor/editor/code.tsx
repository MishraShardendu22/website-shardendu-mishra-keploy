/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as monaco from "monaco-editor";
import { duration } from "@mui/material";
import { File } from "../utils/file-manager";
import { useEffect, useState, useRef } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useEditTestSubscription } from "@/app/api/automatic-test-generator/Subscription";
export const Code = ({
  selectedFile,
  showSideBannerBool,
  RemoveSideBanner,
  settingCodeTheme,
  isFullScreen,
  selectedFileName,
}: {
  selectedFile: File | undefined;
  showSideBannerBool: boolean;
  RemoveSideBanner: () => void;
  settingCodeTheme: boolean;
  isFullScreen: boolean;
  selectedFileName: string | undefined;
}) => {
  if (!selectedFile) return null;

  const code = selectedFile.content;
  const monacoInstance = useMonaco();
  const testFileRegex = /^test-\d+\.yaml$/;
  let language = selectedFile.name.split(".").pop();
  const [showText, setShowText] = useState<boolean>(false);
  const [codeSubmissionId, setSubmissionId] = useState("");
  const { handleSubmit } = useEditTestSubscription(codeSubmissionId);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  if (language === "js" || language === "jsx") language = "javascript";
  else if (language === "go") language = "go";
  else if (language === "py") language = "python";

  useEffect(() => {
    const storedCodeSubmissionId = localStorage.getItem("code_submission_id") || "";
    setSubmissionId(storedCodeSubmissionId)
    // console.log("new stored id: ", codeSubmissionId);
  },[localStorage , selectedFile])

  const handleFileChange = async (newValue: string | undefined) => {
    if (newValue !== undefined) {
      selectedFile.content = newValue;

      if (selectedFileName && testFileRegex.test(selectedFileName)) {
        const testSetName = localStorage.getItem("selectedTestSetDir") || "";

        const { data, loading, error } = await handleSubmit(newValue, testSetName, selectedFileName);

        try {
          if (!loading && data) {
            console.log("Subscription successful:", data);
          } else if (error) {
            console.error("Subscription error:", error);
          }
        } catch (error) {
          console.error("Promise rejected:", error);
        }
  
      }
    }
  };
  

  useEffect(() => {
    if (monacoInstance && editorRef.current) {
      const layoutEditor = () => {
        editorRef.current?.layout();
      };
      layoutEditor();

      window.addEventListener("resize", layoutEditor);
      return () => { window.removeEventListener("resize", layoutEditor); };
    }
  }, [isFullScreen, monacoInstance]);

  const validateCode = (code: string) => {
    const diagnostics: monaco.editor.IMarkerData[] = [];
    const stack: { char: string; position: number }[] = [];
    const openBrackets = "{[(";
    const closeBrackets = "}])";
    const matchingBracket: Record<string, string> = {
      "}": "{",
      "]": "[",
      ")": "(",
    };

    const stringDelimiters = ['"', "'", "`"];
    const stringStack: { char: string; position: number }[] = [];

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const prevChar = code[i - 1];

      if (openBrackets.includes(char)) {
        stack.push({ char, position: i });
      }else if (closeBrackets.includes(char)) {
        if (
          stack.length === 0 ||
          stack[stack.length - 1].char !== matchingBracket[char]
        ) {
          diagnostics.push({
            severity: 8,
            message: `Unmatched closing bracket '${char}'`,
            startLineNumber: code.slice(0, i).split("\n").length,
            startColumn: (code.slice(0, i).split("\n").pop()?.length ?? 0) + 1,
            endLineNumber: code.slice(0, i).split("\n").length,
            endColumn: (code.slice(0, i).split("\n").pop()?.length ?? 0) + 2,
          });
        } else {
          stack.pop();
        }
      }

      if (stringDelimiters.includes(char) && prevChar !== "\\") {
        if (
          stringStack.length === 0 ||
          stringStack[stringStack.length - 1].char !== char
        ) {
          stringStack.push({ char, position: i });
        } else {
          stringStack.pop();
        }
      }
    }

    stack.forEach(({ char, position }) => {
      diagnostics.push({
        severity: 8,
        message: `Unmatched opening bracket '${char}'`,
        startLineNumber: code.slice(0, position).split("\n").length,
        startColumn:
          (code.slice(0, position).split("\n").pop()?.length ?? 0) + 1,
        endLineNumber: code.slice(0, position).split("\n").length,
        endColumn: (code.slice(0, position).split("\n").pop()?.length ?? 0) + 2,
      });
    });

    stringStack.forEach(({ char, position }) => {
      diagnostics.push({
        severity: 8,
        message: `Unmatched string delimiter '${char}'`,
        startLineNumber: code.slice(0, position).split("\n").length,
        startColumn:
          (code.slice(0, position).split("\n").pop()?.length ?? 0) + 1,
        endLineNumber: code.slice(0, position).split("\n").length,
        endColumn: (code.slice(0, position).split("\n").pop()?.length ?? 0) + 2,
      });
    });

    return diagnostics;
  };

  useEffect(() => {
    if (monacoInstance) {
      const model = monacoInstance.editor.getModels()[0];
      const validate = () => {
        const code = model.getValue();
        const diagnostics = validateCode(code);
        monacoInstance.editor.setModelMarkers(model, "owner", diagnostics);
      };

      validate();
      const subscription = model.onDidChangeContent(() => { validate(); });
      return () => { subscription.dispose(); };
    }
  }, [monacoInstance]);

  useEffect(() => {
    if (monacoInstance) {
      monacoInstance.editor.defineTheme("atom-one-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "", background: "282c34", foreground: "abb2bf" },
          { token: "comment", foreground: "5c6370", fontStyle: "italic" },
          { token: "string", foreground: "98c379" },
          { token: "keyword", foreground: "c678dd" },
          { token: "number", foreground: "d19a66" },
          { token: "type", foreground: "e06c75" },
          { token: "function", foreground: "61afef" },
        ],
        colors: {
          "editor.background": "#282c34",
          "editor.foreground": "#abb2bf",
          "editor.lineHighlightBackground": "#2c313a",
          "editorCursor.foreground": "#528bff",
          "editorIndentGuide.background": "#3b4048",
          "editorIndentGuide.activeBackground": "#3b4048",
        },
      });
      if (settingCodeTheme) {
        monacoInstance.editor.setTheme("light");
      } else {
        monacoInstance.editor.setTheme("atom-one-dark");
      }
    }
  }, [monacoInstance, settingCodeTheme]);

  return (
    <div
      className={`${isFullScreen ? "h-full" : "h-[75vh]"} ${
        settingCodeTheme ? "border border-gray-300" : ""
      } relative`}
    >
      <Editor
        language={language}
        value={code}
        theme={settingCodeTheme ? "light" : "atom-one-dark"}
        options={{
          scrollBeyondLastLine: false,
          fontSize: 15,
        }}
        onChange={(newValue) => { void handleFileChange(newValue); }}
        onMount={(editor) => (editorRef.current = editor)}
      />
      {
        <div
          onMouseEnter={() => { setShowText(true); }}
          onMouseLeave={() => { setShowText(false); }}
          className={`p-2 absolute z-10 hover:cursor-pointer border border-gray-500 border-b-0 right-0 top-1/2 bg-secondary-300 flex items-center justify-center shadow-lg transition-all duration-500`}
          style={{
            transform: "translateY(-50%)",
            height: "3rem",
            width: showText ? "200px" : "40px",
          }}
          onClick={() => {
            RemoveSideBanner();
            setShowText(false);
          }}
        >
          <ChevronLeftIcon className="text-gray-50" />
          <div
            className={`overflow-hidden whitespace-nowrap transition-all duration-500 ${
              showText ? "w-full" : "w-0"
            }`}
          >
            <p className="text-gray-50 font-bold ml-2 text-sm">
              Side Content
            </p>
          </div>
        </div>
      }
    </div>
  );
};
