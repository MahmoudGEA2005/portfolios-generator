import "./ActionBtn.css";

function ActionBtn({ additionalClass = "", children, ...proxy }) {
  return (
    <div className={`pseudo-container ${additionalClass}`} {...proxy}>
      <button type="submit">{children}</button>
    </div>
  );
}

export default ActionBtn;
