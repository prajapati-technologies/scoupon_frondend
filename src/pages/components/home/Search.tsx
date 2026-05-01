import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search-vendors?search=${searchQuery}`);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-center mb-8 w-full max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Enter your ZIP code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-2 sm:mb-0 sm:mr-2 sm:rounded-r-none bg-white text-gray-800 shadow-md"
        />
        <Button
          onClick={handleSearch}
          className="w-full sm:w-auto sm:rounded-l-none bg-[#a0b830] hover:bg-[#a0b830] text-white shadow-lg transition duration-300"
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default Search;