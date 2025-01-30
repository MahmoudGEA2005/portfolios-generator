import "./LabelledInput.css";

function LabelledInput({
  field,
  error,
  register,
  extraClass = "",
  readOnly = false,
}) {
  return (
    <div className={`labelled-input ${extraClass}`}>
      <label htmlFor={field.name}>{field.labelName}</label>
      {field.type !== "textarea" ? (
        <input
          type={field.type}
          name={field.name}
          id={field.name}
          {...register(field.name, {
            required: `${field.labelName} is required`,
          })}
          accept={field.name === "picture" ? "image/*" : undefined}
          readOnly={readOnly}
        />
      ) : (
        <textarea
          type={field.type}
          name={field.name}
          id={field.name}
          {...register(field.name, {
            required: `${field.labelName} is required`,
          })}
        ></textarea>
      )}
      {error && <p className="error">{error.message}</p>}
    </div>
  );
}

export default LabelledInput;
