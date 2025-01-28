import "./Toolkit.css";

function Toolkit({ close, children }) {
  return (
    <div className="toolkit-container">
      <div className="toolkit">
        <h1>Action</h1>
        <div className="close-position">
          <div className="close-container">
            <button
              className="close"
              onClick={() => {
                close(null);
              }}
            >
              X
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Toolkit;
