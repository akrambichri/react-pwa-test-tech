import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ logOut }) => {
  const [menuClicked, setMenuClicked] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMenuClicked(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const toggleMenu = () => {
    if (menuClicked) return;
    setMenuClicked(!menuClicked);
  };

  const activeClass =
    "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium";
  const defaultClass =
    "text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium";
  return (
    <>
      <div className="bg-gray-100">
        <nav data-todo-x-data="{ open: false }" className="bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <NavLink to="/">
                    <img
                      className="block h-8 w-auto"
                      src="logo512.png"
                      alt="Workflow"
                      height="32"
                      width="32"
                    />
                  </NavLink>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                    <NavLink
                      to="/audios"
                      className={({ isActive }) =>
                        isActive ? activeClass : defaultClass
                      }
                    >
                      Audios
                    </NavLink>
                    <NavLink
                      to="/images"
                      className={({ isActive }) =>
                        isActive ? activeClass : defaultClass
                      }
                    >
                      Images
                    </NavLink>
                    <NavLink
                      to="/videos"
                      className={({ isActive }) =>
                        isActive ? activeClass : defaultClass
                      }
                    >
                      Videos
                    </NavLink>
                    <button
                      type="button"
                      aria-label="log out button"
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                      onClick={logOut}
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </div>
              <div className="-mr-2 flex sm:hidden">
                {/* Mobile menu button */}
                {menuClicked ? (
                  <div className="inline-flex cursor-pointer items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <button
                    type="button"
                    aria-label="toggle menu button"
                    onClick={toggleMenu}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {menuClicked && (
            <div
              ref={wrapperRef}
              data-todo-x-description="Mobile menu, show/hide based on menu state."
              className="sm:hidden"
              id="mobile-menu"
              data-todo-x-show="open"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                <NavLink
                  to="/audios"
                  className={({ isActive }) =>
                    isActive ? activeClass : defaultClass
                  }
                >
                  Audios
                </NavLink>
                <NavLink
                  to="/images"
                  className={({ isActive }) =>
                    isActive ? activeClass : defaultClass
                  }
                >
                  Images
                </NavLink>
                <NavLink
                  to="/videos"
                  className={({ isActive }) =>
                    isActive ? activeClass : defaultClass
                  }
                >
                  Videos
                </NavLink>
                <button
                  type="button"
                  aria-label="log out button"
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                  onClick={logOut}
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
