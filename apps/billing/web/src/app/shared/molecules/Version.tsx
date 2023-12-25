import React from 'react';
import { INFO } from '../../../environment';

const Version = () => {
  return (
    <div className="text-end text-gray-400 px-1 text-xs font-semibold">
      v{INFO.version}
    </div>
  );
};

export default Version;
