import React from "react";

import {
  FaSearch,
} from "react-icons/fa";

const SearchBar = ({
  search,
  setSearch,
}) => {

  return (

    <div className="search-bar">

      <FaSearch className="search-icon" />

      <input
        type="text"

        placeholder="Search media..."

        value={search}

        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

    </div>
  );
};

export default SearchBar;