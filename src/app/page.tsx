"use client";
import { useState } from "react";
import { Search, Menu, Eye, Clock, ThumbsUp, Calendar } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Calendar as CalendarComponent } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { format, isWithinInterval, parseISO } from "date-fns";
import { type DateRange } from "react-day-picker";
// import Testbutton from "./_components/testbutton";
import AudioPlayer from "./_components/audioPlayer";

export default function Component() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [category, setCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading_button, setIsLoading_button] = useState("");

  const categories = ["All", "Tech", "Politics", "Culture", "Science"];

  const articles = [
    {
      title: "AI Singularity: The Day Machines Outsmarted Humanity",
      excerpt:
        "In a shocking turn of events, artificial intelligence has reached a level of sophistication that surpasses human cognitive abilities...",
      author: "Zoe Nexus",
      date: "2024-06-15",
      readTime: 5,
      views: 1500000,
      likes: 95,
      category: "Tech",
    },
    {
      title: "Cybernetic Implants Now Mandatory for All Citizens",
      excerpt:
        "The government has announced a controversial new policy requiring all citizens to undergo cybernetic enhancement...",
      author: "Rex Voltage",
      date: "2024-06-14",
      readTime: 7,
      views: 2000000,
      likes: 88,
      category: "Politics",
    },
    {
      title: "Virtual Reality Addiction Reaches Epidemic Proportions",
      excerpt:
        "Hospitals are overwhelmed as millions of people struggle to disconnect from immersive virtual worlds...",
      author: "Luna Stardust",
      date: "2077-06-13",
      readTime: 6,
      views: 1800000,
      likes: 92,
      category: "Culture",
    },
    {
      title: "Megacorporation Wars: The Battle for Neo-Tokyo",
      excerpt:
        "Armed conflicts between rival megacorporations have turned the streets of Neo-Tokyo into a battleground...",
      author: "Blade Runner",
      date: "2024-06-12",
      readTime: 8,
      views: 2500000,
      likes: 97,
      category: "Politics",
    },
  ];

  function handle_loading_animation(boolean: boolean, string: string) {
    setIsLoading(boolean);
    setIsLoading_button(string);
  }

  const filteredArticles = articles.filter(
    (article) =>
      (category === "All" || article.category === category) &&
      (!dateRange?.from ||
        !dateRange.to ||
        isWithinInterval(parseISO(article.date), {
          start: dateRange.from,
          end: dateRange.to,
        })),
  );

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
            <AudioPlayer />
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

        <div className="mb-6 flex flex-wrap gap-4">
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`button-hover ${category === cat ? "bg-red-600" : "bg-gray-800"} text-white hover:bg-red-700`}
            >
              {cat}
              <span className="ml-2 text-xs">Subscribe</span>
            </Button>
          ))}
        </div>

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

        <div className="space-y-6">
          {filteredArticles.map((article, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-red-800 bg-gray-900 p-6 transition-shadow hover:shadow-lg hover:shadow-red-500/20"
            >
              <h3 className="glitch mb-2 text-2xl font-semibold text-white">
                {article.title}
              </h3>
              <p className="mb-4 text-red-300">{article.excerpt}</p>
              <div className="mb-4 flex items-center justify-between text-sm text-red-400">
                <span>{article.author}</span>
                <span>{article.date}</span>
              </div>
              <div className="mb-4 flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span className="text-sm">{article.readTime} min read</span>
                </div>
                <div className="flex items-center">
                  <Eye className="mr-1 h-4 w-4" />
                  <span className="text-sm">
                    {article.views.toLocaleString()} views
                  </span>
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  <span className="text-sm">{article.likes}% engagement</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="mb-1 text-sm text-red-300">Engagement</p>
                <Progress value={article.likes} className="h-2 bg-red-900">
                  <div
                    className="h-full bg-red-500 transition-all duration-500 ease-in-out"
                    style={{ width: `${article.likes}%` }}
                  />
                </Progress>
              </div>
              <button
                className={`read-article-button relative w-full overflow-hidden bg-red-600 py-2 text-white transition-colors duration-300`}
                onMouseEnter={() =>
                  handle_loading_animation(true, article.title)
                }
                onMouseLeave={() => handle_loading_animation(false, "")}
              >
                <span
                  className={`absolute inset-0 z-10 h-full w-full transition-transform duration-300 ${
                    isLoading && article.title === isLoading_button
                      ? "translate-x-0 transform bg-red-700"
                      : "-translate-x-full transform"
                  }`}
                  style={{
                    transition: "transform 1s ease-in-out",
                  }}
                />
                <span className="relative z-10">
                  {isLoading && article.title === isLoading_button
                    ? "PENETRATING FIREWALL"
                    : "Read Full Article"}
                  {/* <ChevronRight className="ml-2 h-4 w-4" /> */}
                </span>
              </button>
            </div>
          ))}
        </div>
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
