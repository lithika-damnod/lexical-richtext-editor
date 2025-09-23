import Editor from "@/components/editor";

function App() {
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
      <div style={{ width: "80%", marginBottom: "10rem" }}>
        <Editor />
      </div>
    </section>
  );
}

export default App;
