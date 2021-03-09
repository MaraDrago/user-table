import React from "react";
import _ from "lodash";
import styled from "@emotion/styled";

// create an array to be used for users table columns
const userTableColumns = [
  {
    field: "fullName",
    name: "Full Name",
  },
  {
    field: "balance",
    name: "Balance",
  },
  {
    field: "isActive",
    name: "Is active",
  },
  {
    field: "registered",
    name: "Is registered",
  },
  {
    field: "state",
    name: "State",
  },
  {
    field: "country",
    name: "Country",
  },
];

// Styled components for the table, search and pagination

const Container = styled.div`
  max-width: 1110px;
  padding: 30px 30px;
  margin: 0 auto;
`;

const SortIndicator = styled.div`
  transform: ${(props) => (props.isReversed ? "rotate(180deg)" : "")};
  position: absolute;
  right: 10px;
  top: 15px;
`;

const SearchAndPaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PaginationText = styled.div`
  line-height: 38px;
  padding: 0 15px;
`;

const ItemsPerPage = styled.a`
  cursor: pointer;
  padding: 0 5px;
  color: #bee5eb;
  :hover {
    box-shadow: inset 0 0 15px rgba(22, 171, 226, 0.25);
  }

  text-decoration: ${(props) => (props.isActive ? "underline" : "none")};
  color: ${(props) => (props.isActive ? "#17a2b8" : "")};
`;

export const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 250px;
  height: 10px;
  border-radius: 25px;
  border: 2px solid #bee5eb;
  outline: none;
  background-color: #ffffff;
  padding: 20px;
  ::placeholder {
    color: #bee5eb;
  }
  :hover {
    box-shadow: inset 0 0 15px rgba(22, 171, 226, 0.25);
  }
`;
export const SearchIcon = styled.img`
  width: 18px;
  height: 18px;
  position: absolute;
  right: 25px;
  top: 14px;
  color: #bee5eb !important;
  @media (max-width: 880px) {
    top: 16px;
  }
`;

// Users table component

function UsersTable({ users }) {
  // users table hooks
  const [searchTerm, setSearchTerm] = React.useState("");
  const [tableItems, setTableItems] = React.useState([]);
  const [tableItemsPerPage, setTableItemsPerPage] = React.useState(100);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [sortBy, setSortBy] = React.useState("fullName");
  const [isReversed, setIsReversed] = React.useState(false);
  const [totalPages, setTotalPages] = React.useState(0);

  // depending on table hooks provided in the dependencies array process
  // users array by first filtering by search input, then sorting, then applying
  // pagination
  React.useEffect(() => {
    // filter users array by all columns content using search input value
    const filteredUsers = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchTerm) ||
        user.balance.toLowerCase().includes(searchTerm) ||
        user.registered.toLowerCase().includes(searchTerm) ||
        user.state.toLowerCase().includes(searchTerm) ||
        user.country.toLowerCase().includes(searchTerm)
    );

    // sort filtered users by sortBy hook value which is the selected column name
    // (e.g. fullName which is the default value)
    const sortedUsers = _.sortBy(filteredUsers, [sortBy]);

    // reverse the sorted users array if sort is descending
    if (isReversed) {
      sortedUsers.reverse();
    }

    // calculate total pages depending on filteredUsers length and selected
    // number of items per page
    setTotalPages(Math.ceil(filteredUsers.length / tableItemsPerPage));

    // calculate pagination index star and index end needed for slice method
    // and slice sortedUsers
    const paginationStartIndex = currentPage * tableItemsPerPage;
    const paginationEndIndex = (currentPage + 1) * tableItemsPerPage;
    const paginatedUsers = sortedUsers.slice(
      paginationStartIndex,
      paginationEndIndex
    );

    // set array used for table rendering
    setTableItems(paginatedUsers);
  }, [searchTerm, tableItemsPerPage, currentPage, sortBy, isReversed]);

  // search input handler
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    // reset page to first result
    setCurrentPage(0);
  };

  // table sort handler on column heading click
  const handleTableSort = (user) => {
    if (sortBy === user.field) {
      // if sorting by current column reversed sort
      setIsReversed(!isReversed);
    } else {
      // if sorting by new column set sort direction to default order
      // and set sortBy by selected column
      setIsReversed(false);
      setSortBy(user.field);
    }
  };

  return (
    <Container className="App">
      <SearchAndPaginationWrapper>
        <InputWrapper>
          <Input
            type="text"
            placeholder="Search"
            onChange={handleSearchInputChange}
          />
          <span>
            <SearchIcon src="./search-icon.svg" />
          </span>
        </InputWrapper>
        <ul>
          <PaginationText>
            Items per page:
            <ItemsPerPage
              onClick={() => setTableItemsPerPage(20)}
              isActive={tableItemsPerPage === 20}
            >
              20
            </ItemsPerPage>
            <ItemsPerPage
              onClick={() => setTableItemsPerPage(50)}
              isActive={tableItemsPerPage === 50}
            >
              50
            </ItemsPerPage>
            <ItemsPerPage
              onClick={() => setTableItemsPerPage(100)}
              isActive={tableItemsPerPage === 100}
            >
              100
            </ItemsPerPage>
          </PaginationText>
        </ul>
      </SearchAndPaginationWrapper>
      <nav>
        <ul className="pagination justify-content-center">
          <div>
            <PaginationText>
              Current page:{" "}
              <a style={{ color: "#93cae6" }}>{currentPage + 1}</a> of{" "}
              <a style={{ color: "#93cae6" }}>{totalPages}</a> pages
            </PaginationText>
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 0 ? "disabled" : ""}`}
              >
                <a
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  style={{ color: ` ${currentPage === 0 ? "" : "#93cae6"}` }}
                >
                  Previous
                </a>
              </li>
              <li
                className={`page-item ${
                  currentPage === totalPages - 1 ? "disabled" : ""
                }`}
              >
                <a
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  style={{
                    color: ` ${
                      currentPage === totalPages - 1 ? "" : "#93cae6"
                    }`,
                  }}
                >
                  Next
                </a>
              </li>
            </ul>
          </div>
        </ul>
      </nav>
      <table className="table table-bordered table-striped">
        <thead>
          <tr className="table-info" style={{ width: "226px", height: "39px" }}>
            {userTableColumns.map((user) => (
              <th
                key={user.field}
                scope="col"
                onClick={() => handleTableSort(user)}
                style={{ position: "relative" }}
              >
                {user.name}
                {sortBy === user.field ? (
                  <SortIndicator isReversed={isReversed}>⇩</SortIndicator>
                ) : null}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableItems.map((item) => (
            <tr key={item.id}>
              <td style={{ width: "20%", height: "39px" }}>{item.fullName}</td>
              <td style={{ width: "13%", height: "39px" }}>{item.balance}</td>

              <td style={{ width: "13%", height: "39px" }}>
                {item.isActive ? "yes" : "no"}
              </td>
              <td style={{ width: "20%", height: "39px" }}>
                {item.registered}
              </td>
              <td style={{ width: "13%", height: "39px" }}>{item.state}</td>
              <td style={{ width: "20%", height: "39px" }}>{item.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}

export default UsersTable;
