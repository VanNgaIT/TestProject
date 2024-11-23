import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable, useSortBy } from 'react-table';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://araonsoft.com:9081/api/Test/GetSampleUserList')
      .then(response => {
        if (Array.isArray(response.data.results)) {
          setUsers(response.data.results);
        } else {
          console.error('Dữ liệu không phải là mảng:', response.data.results);
        }
      })
      .catch(error => console.error(error));
  }, []);

  const columns = React.useMemo(() => [
    { Header: 'Name', accessor: 'name.first', disableSortBy: false },
    { Header: 'Gender', accessor: 'gender', disableSortBy: false },
    { Header: 'Age', accessor: 'dob.age', disableSortBy: false },
    { Header: 'Region', accessor: 'location.city', disableSortBy: false },
  ], []);

  const filteredUsers = React.useMemo(() => {
    return users.filter(user =>
      `${user.name.first} ${user.name.last}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]); 
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = useTable(
    {
      columns,
      data: filteredUsers,
      initialState: {
        sortBy: [{ id: 'name.first', desc: false }], 
      },
    },
    useSortBy
  );

  return (
    <div>
      <h1>User List</h1>

      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, headerIndex) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerIndex}>
              {headerGroup.headers.map((column, columnIndex) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{ cursor: 'pointer' }}
                  key={columnIndex}
                >
                  {column.render('Header')}
                  <span>
                    {sortBy.find(s => s.id === column.id)
                      ? (sortBy.find(s => s.id === column.id).desc ? ' 🔽' : ' 🔼')
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={rowIndex}>
                {row.cells.map((cell, cellIndex) => (
                  <td {...cell.getCellProps()} key={cellIndex}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
