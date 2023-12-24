import React from 'react';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  label?: string;
  slug?: string;
  onClick?: () => void;
}

const SidebarItem = ({ label, onClick, slug }: Props) => {
  const location = useLocation();
  return slug ? (
    <Link to={slug}>
      <div
        className={clsx([
          'p-2 m-2 border rounded-lg cursor-pointer',
          'transition-all duration-300 hover:shadow-lg hover:bg-gray-50 hover:pl-3',
          slug === location.pathname &&
            'bg-blue-500 text-white pl-3 hover:text-black',
        ])}
      >
        {label}
      </div>
    </Link>
  ) : (
    <div className="p-2">No slug</div>
  );
};

export default SidebarItem;
