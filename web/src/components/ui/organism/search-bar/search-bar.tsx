"use client";

import React, { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema, type SearchFormData } from "@/components/ui/organism/search-bar/schema/search-validation";
import { useDebounce } from "@/components/ui/organism/search-bar/hooks/search-debounce";

import { Button } from "@/components/ui/atomic/button";
import { HiMapPin, HiMiniChevronDown } from "react-icons/hi2";

export default function SearchBar() {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "" },
    mode: "onChange",
  });

  const query = watch("query");
  const debouncedQuery = useDebounce(query, 500);

  // Handle form submission
  const onSubmit = (data: SearchFormData) => {
    console.log("Search submitted:", data.query);
    // Your search API call here
    performSearch(data.query);
  };

  // Perform search function
  const performSearch = async (searchQuery: string) => {
    setIsSearching(true);
    try {
      // Simulate API call - replace with your actual search logic
      const mockResults = [
        `Result 1 for "${searchQuery}"`,
        `Result 2 for "${searchQuery}"`,
        `Result 3 for "${searchQuery}"`,
      ];

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSearchResults(mockResults);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-search effect with debounce
  useEffect(() => {
    if (debouncedQuery.length >= 3) {
      performSearch(debouncedQuery);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [debouncedQuery]);

  return (
    <div className="w-full max-w-sm mx-auto p-3 sm:p-6 sm:max-w-md">
      <div className="flex">
        <div className="">
          {/* Search Input Section */}
          <div className="flex gap-2 w-[400px] border p-1 bg-white">
            <Controller
              name="query"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Search events"
                  className="w-full pl-2 py-2 text-sm focus:outline-none focus:bg-blue-100 bg-white font-sans focus:border-transparent disabled:bg-gray-100 sm:text-base"
                />
              )}
            />
            <Button
              variant={"ghost"}
              size={"sm"}
              className="font-sans gap-1.5 hover:bg-blue-100/40"
            >
              <HiMapPin />
              Location
              <HiMiniChevronDown />
            </Button>
          </div>
          <div>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid || isSearching}
              size="sm"
              className="font-sans gap-1 text-sm hover:bg-blue-100/40 cursor-pointer sm:gap-1.5 sm:text-base"
            >
              Search
            </Button>
          </div>

          {errors.query && (
            <div className="text-start">
              <p className="text-red-600 text-[10px] font-sans">
                {errors.query.message}
              </p>
            </div>
          )}
        </div>
      </div>
      {query.length >= 3 && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
          {isSearching ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="text-sm text-gray-500">Searching for ...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <h4 className="text-sm font-semibold mb-3 text-gray-700">
                Search Results ({searchResults.length})
              </h4>
              <ul className="absolute space-y-2">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 p-2 rounded cursor-pointer transition-colors"
                    onClick={() => console.log("Selected:", result)}
                  >
                    {result}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No results found for...</p>
              <p className="text-xs text-gray-400 mt-1">
                Try different keywords
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

//   return (
//     <div className="flex gap-2 w-[400px] border p-1 bg-white">
//       <Button
//         variant={"ghost"}
//         size={"sm"}
//         className="font-sans gap-1.5 hover:bg-blue-100/40 cursor-pointer"
//       >
//         <HiMapPin />
//         Location
//         <HiMiniChevronDown />
//       </Button>
//       <Controller
//         name="query"
//         control={control}
//         render={({ field }) => (
//           <Input
//             {...field}
//             type="text"
//             placeholder="Search... (min 3 characters)"
//             className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             onChange={(e) => {
//               field.onChange(e);
//             }}
//           />
//         )}
//       />

//       <Button
//         type="button"
//         onClick={handleSubmit(onSubmit)}
//         disabled={!isValid}
//         className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3 bg-blue-600 text-white text-sm rounded disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
//       >
//         Search
//       </Button>

//       {errors.query && (
//         <p className="text-red-600 text-sm mt-1">{errors.query.message}</p>
//       )}
//     </div>
//   );
// }
