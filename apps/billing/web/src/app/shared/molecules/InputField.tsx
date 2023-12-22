import { Input, InputOnChangeData, Label } from '@fluentui/react-components';

interface Props {
  label?: string;
  name: string;
  placeholder?: string;
  onChange: (
    ev: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void;
  value: string;
  labelSize?: 'small' | 'medium' | 'large';
  fieldSize?: 'small' | 'medium' | 'large';
  type?:
    | 'number'
    | 'search'
    | 'time'
    | 'text'
    | 'email'
    | 'password'
    | 'tel'
    | 'url'
    | 'date'
    | 'datetime-local'
    | 'month'
    | 'week';
  required?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  max?: number;
  min?: number;
}

const InputField = ({
  value,
  label,
  name,
  onChange,
  placeholder,
  labelSize = 'medium',
  fieldSize = 'large',
  type = 'text',
  required = false,
  onFocus,
  onBlur,
  disabled = false,
  max,
  min,
}: Props) => {
  return (
    <div className="flex-1">
      {label && (
        <Label htmlFor={name} size={labelSize}>
          <span className="text-gray-400">{label}</span>
        </Label>
      )}
      <Input
        max={max}
        min={min}
        disabled={disabled}
        className="w-full"
        required={required}
        type={type}
        onChange={onChange}
        value={value}
        id={name}
        name={name}
        size={fieldSize}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};

export default InputField;
