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
}: Props) => {
  return (
    <>
      {label && (
        <Label htmlFor={name} size={labelSize}>
          {label}
        </Label>
      )}
      <Input
        required={required}
        type={type}
        onChange={onChange}
        value={value}
        id={name}
        name={name}
        size={fieldSize}
        placeholder={placeholder}
      />
    </>
  );
};

export default InputField;
