import Editor from "@monaco-editor/react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  height?: number;
}

export function CodeEditor({ value, onChange, height = 320 }: Props) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10">
      <Editor
        height={height}
        defaultLanguage="python"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          automaticLayout: true,
        }}
      />
    </div>
  );
}
