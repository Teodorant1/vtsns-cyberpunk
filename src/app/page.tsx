"use client";
import { useState } from "react";
import { Search, Menu, Clock, Calendar } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Calendar as CalendarComponent } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { addDays, format, isWithinInterval, parseISO, subDays } from "date-fns";
import { type DateRange } from "react-day-picker";
// import Testbutton from "./_components/testbutton";
// import AudioPlayer from "./_components/audioPlayer";
import { api } from "~/trpc/react";
// import Link from "next/link";

export default function Component() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: addDays(new Date(), 1),
  });
  // const [category, setCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading_button, setIsLoading_button] = useState("");
  const [currentcategory, setcurrentcategory] = useState("All");
  const [currentArticle, setcurrentArticle] = useState("");
  const articles = api.post.getLatest_articles.useQuery({
    subject: currentcategory,
    from: dateRange?.from,
    to: dateRange?.to,
  });
  const categories = api.post.getSubjects.useQuery();

  function ToggleCategory(input: string) {
    if (currentcategory === input) {
      setcurrentcategory("All");
    } else {
      setcurrentcategory(input);
    }
  }

  function handle_loading_animation(boolean: boolean, string: string) {
    setIsLoading(boolean);
    setIsLoading_button(string);
  }

  function filteredArticles() {
    const newarticles = articles.data!.filter(
      (article) =>
        (currentcategory === "All" || article.subject === currentcategory) &&
        (!dateRange?.from ||
          !dateRange.to ||
          isWithinInterval(parseISO(article.createdAt.toISOString()), {
            start: dateRange.from,
            end: dateRange.to,
          })),
    );
    return newarticles;
  }

  function PaginatedList() {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 10;

    const startIdx = currentPage * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const currentItems = categories.data!.slice(startIdx, endIdx);

    const handleNext = () => {
      if (endIdx < categories.data!.length) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    const handlePrevious = () => {
      if (startIdx > 0) {
        setCurrentPage((prev) => prev - 1);
      }
    };

    return (
      <div className="mb-6 flex flex-wrap gap-3">
        <div>
          {" "}
          <div>
            <div>
              Total Available Subjects: {categories.data!.length} , Current
              Page: {currentPage + 1}{" "}
            </div>
            <button
              className="m-5"
              onClick={handlePrevious}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <button
              className="m-5"
              onClick={handleNext}
              disabled={endIdx >= categories.data!.length}
            >
              Next
            </button>
          </div>
          {currentItems.map((cat, index) => (
            <Button
              key={cat.id}
              onClick={() => ToggleCategory(cat.name)}
              className={`button-hover mx-5 my-2 ${currentcategory === cat.name ? "bg-red-600" : "bg-gray-800"} text-white hover:bg-red-700`}
            >
              {cat.name}
              {/* <span className="ml-2 text-xs">Subscribe</span> */}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-red-500">
      <style jsx>{`
        @keyframes glitch {
          0% {
            text-shadow:
              0.05em 0 0 rgba(255, 0, 0, 0.75),
              -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          14% {
            text-shadow:
              0.05em 0 0 rgba(255, 0, 0, 0.75),
              -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          15% {
            text-shadow:
              -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
              0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          49% {
            text-shadow:
              -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
              0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
              -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          50% {
            text-shadow:
              0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          99% {
            text-shadow:
              0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
              0.05em 0 0 rgba(0, 255, 0, 0.75),
              0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          100% {
            text-shadow:
              -0.025em 0 0 rgba(255, 0, 0, 0.75),
              -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
              -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
        }

        .glitch {
          animation: glitch 1s linear infinite;
        }

        @keyframes scanline {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        .scanline {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(255, 0, 0, 0.2),
            transparent
          );
          pointer-events: none;
          animation: scanline 10s linear infinite;
        }

        .button-hover {
          transition: all 0.3s ease;
        }

        .button-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(255, 0, 0, 0.5);
        }

        .calendar-transition {
          transition: all 0.3s ease;
        }

        .calendar-transition:hover {
          background-color: rgba(255, 0, 0, 0.1);
        }

        @keyframes loadingBar {
          0% {
            width: 0;
          }
          100% {
            width: 100%;
          }
        }

        .read-article-button {
          position: relative;
          border: none; /* Remove default button border */
          cursor: pointer; /* Change cursor to pointer */
        }

        .read-article-button:hover {
          /* Optional: Add box shadow on hover */
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="scanline"></div>

      <header className="border-b border-red-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1
            className="glitch text-2xl font-bold tracking-wider text-red-600"
            style={{ textShadow: "2px 2px 4px rgba(255,0,0,0.5)" }}
          >
            CYBER<span className="text-white">NEWS</span>
          </h1>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="transition-colors hover:text-red-400">
                  Headlines
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-red-400">
                  Tech
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-red-400">
                  Politics
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-red-400">
                  Netwatch
                </a>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:bg-red-900/20 hover:text-red-400"
            >
              <Search className="h-5 w-5" />
            </Button>
            {/* <AudioPlayer /> */}
            {/* <Testbutton /> */}
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:bg-red-900/20 hover:text-red-400 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="glitch text-3xl font-bold text-white">
            Breaking News
          </h2>
        </div>
        {categories.data ? (
          <div>
            <PaginatedList />
          </div>
        ) : (
          "Loading categories please wait................"
        )}

        <div className="mb-6 flex space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-[300px] justify-start border-red-800 bg-gray-900 text-left font-normal text-red-500 ${
                  !dateRange ? "text-muted-foreground" : ""
                }`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto border-red-800 bg-gray-900 p-0">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="calendar-transition"
              />
            </PopoverContent>
          </Popover>
        </div>

        {articles.data && dateRange?.from && dateRange.to ? (
          <div className="space-y-6">
            {filteredArticles().map((article, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-red-800 bg-gray-900 p-6 transition-shadow hover:shadow-lg hover:shadow-red-500/20"
              >
                <h3 className="glitch mb-2 text-2xl font-semibold text-white">
                  {article.subject} - {article.title}
                </h3>
                {/* <p className="mb-4 text-red-300">{article.excerpt}</p> */}
                <div className="mb-4 flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="mb-4 flex items-center justify-between text-sm text-red-400">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{article.createdAt.toDateString()}</span>
                    </div>
                  </div>
                </div>
                {currentArticle === article.href_title_date && (
                  <div className="mb-4 flex items-center justify-between text-sm text-red-400">
                    {article.text}
                  </div>
                )}{" "}
                {currentArticle !== article.href_title_date && (
                  <button
                    onClick={() => {
                      setcurrentArticle(article.href_title_date);
                      //  console.log("bla bla bla");
                    }}
                    className={`read-article-button relative w-full overflow-hidden bg-red-600 py-2 text-white transition-colors duration-300`}
                    onMouseEnter={() =>
                      handle_loading_animation(true, article.title)
                    }
                    onMouseLeave={() => handle_loading_animation(false, "")}
                  >
                    <div
                      className={`absolute inset-0 z-10 h-full w-full transition-transform duration-300 ${
                        isLoading && article.title === isLoading_button
                          ? "translate-x-0 transform bg-red-700"
                          : "-translate-x-full transform"
                      }`}
                      style={{
                        transition: "transform 1s ease-in-out",
                      }}
                    />

                    {/* {currentArticle} */}

                    <div className="relative z-10">
                      {isLoading && article.title === isLoading_button
                        ? "PENETRATING MEGACORPORATION FIREWALL"
                        : "Read Full Article"}
                      {/* <ChevronRight className="ml-2 h-4 w-4" /> */}
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          "Loading Articles please wait........"
        )}
      </main>

      <footer className="mt-12 border-t border-red-800 bg-gray-900 py-6">
        <div className="container mx-auto text-center">
          <p className="glitch text-red-400">
            &copy; 2077 CyberNews. All rights augmented.
          </p>
        </div>
      </footer>
    </div>
  );
}
