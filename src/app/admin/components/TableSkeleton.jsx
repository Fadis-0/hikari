import React from 'react';
import './TableSkeleton.css';

const TableRowSkeleton = ({ columns }) => {
  return (
    <tr className="skeleton-table-row">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index}>
          <div className="skeleton-text"></div>
        </td>
      ))}
    </tr>
  );
};

const TableSkeleton = ({ columns, rows = 5 }) => {
  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index}><div className="skeleton-text skeleton-header"></div></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRowSkeleton key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
