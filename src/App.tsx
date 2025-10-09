import { useRef } from "react";
import Editor, { type EditorHandle } from "@/components/editor";

function App() {
  const ref = useRef<EditorHandle>(null);

  return (
    <section
      style={{
        width: "100dvw",
        height: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "80%" }}>
        <Editor ref={ref} />
      </div>
      <button
        onClick={() => {
          if (ref.current) console.log(ref.current.export());
        }}
      >
        Export
      </button>
    </section>
  );
}

export default App;
