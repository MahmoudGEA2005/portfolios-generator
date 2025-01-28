import "./InputField.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function InputField({ inp, register, ...proxy }) {
  return (
    <div className="input-container">
      <input
        type={inp.type}
        {...register(inp.name, {
          required: `${inp.placeholder} is required`,
        })}
        placeholder={inp.placeholder}
        {...proxy}
        minLength={inp.type === "password" ? 8 : undefined}
      />
      {inp.icon && <FontAwesomeIcon icon={inp.icon} />}
    </div>
  );
}

export default InputField;
