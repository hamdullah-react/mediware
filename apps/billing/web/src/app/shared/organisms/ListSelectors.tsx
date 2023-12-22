import {
  ChangeEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
} from 'react';
import InputField from '../molecules/InputField';
import { Button } from '@fluentui/react-components';

interface Props<Type> {
  listTitle: string;
  list: Type[];
  renderItem?: (value: Type, index: number, array: Type[]) => ReactNode;
  searchQuery?: string;
  setSearchQuery?: Dispatch<SetStateAction<string>>;
  addNewEntry?: () => void;
}

const ListSelectors = <Type,>({
  list,
  listTitle,
  renderItem,
  searchQuery,
  setSearchQuery,
  addNewEntry,
}: Props<Type>) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (setSearchQuery) {
        setSearchQuery(e.target.value);
      }
    },
    [setSearchQuery]
  );

  return (
    <div>
      {listTitle && <h1 className="mb-3 text-md font-bold">{listTitle}</h1>}
      {searchQuery !== undefined && (
        <div className="my-3 flex flex-row gap-2">
          <InputField
            disabled={!list.length}
            name="searchSupplierField"
            value={searchQuery}
            onChange={handleChange}
            placeholder={
              list.length ? 'Search...' : 'No data in system, please add data'
            }
            fieldSize="large"
            type="text"
          />
          {addNewEntry && (
            <Button size="large" onClick={addNewEntry}>
              New
            </Button>
          )}
        </div>
      )}
      <div className="flex flex-col gap-3 max-h-[300pt] overflow-auto">
        {list.length > 0 && renderItem && list.map(renderItem)}
      </div>
    </div>
  );
};

export default ListSelectors;
