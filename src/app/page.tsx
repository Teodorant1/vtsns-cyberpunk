"use client";
import { useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Calendar as CalendarComponent } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { addDays, format, isWithinInterval, parseISO } from "date-fns";
import { type DateRange } from "react-day-picker";
import PaginatedList from "./_components/PaginatedList";
import { api } from "~/trpc/react";
import HrefLinks from "./_components/href_list";

export default function Component() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.UTC(2024, 8, 1)),
    to: addDays(new Date(), 3),
  });
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
  const dates = api.post.get_latest_date_of_Cronjob.useQuery();
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

  function calculate_daysBetween(date1: Date, date2: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;

    // Normalize both dates to midnight to avoid partial-day issues
    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
    );
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate(),
    );

    return Math.floor((utc2 - utc1) / msPerDay);
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

  return (
    <div className="min-h-screen bg-black text-red-500">
      <div className="scanline"></div>

      <main className="container mx-auto py-8">
        <div className="mb-6 flex items-center justify-between"></div>
        {categories.data ? (
          <div>
            <PaginatedList
              categories={categories.data}
              currentCategory={currentcategory}
              onToggleCategory={ToggleCategory}
            />
          </div>
        ) : (
          "Loading categories please wait................"
        )}

        <div className="mb-6 flex-col space-x-4">
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
                      {format(dateRange.from, "LLL dd, y")} -
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
          <div className="mt-5">
            {dates.data?.currentDate && (
              <div>
                IMPORTANT INFO! THE APP DOESN{"'"}T USE YOUR TIMEZONE AND
                INSTEAD DEFAULTS TO UTC
              </div>
            )}

            {dates.data?.currentDate && (
              <div>Current Date: {dates.data?.currentDate.toISOString()}</div>
            )}
            {dates.data?.latestRun ? (
              <div>
                <div>
                  Last Automatic Update Date:{" "}
                  {dates.data?.latestRun.runDate.toISOString()}
                </div>
                <div>
                  {dates.data?.currentDate && (
                    <div>
                      {}
                      Days since last update:{" "}
                      {calculate_daysBetween(
                        dates.data?.currentDate,
                        dates.data?.latestRun.runDate,
                      )}
                      <div>
                        {calculate_daysBetween(
                          dates.data?.currentDate,
                          dates.data?.latestRun.runDate,
                        ) > 3 ? (
                          <p>
                            <div>
                              More than 3 days have passed since last update!
                            </div>
                            <div>
                              PLEASE CONTACT THE ADMINISTRATOR OF THIS WEBSITE
                              SO HE CAN FIX THIS ISSUE
                            </div>
                          </p>
                        ) : (
                          <p>3 days or fewer have passed since last update.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div>No previous runs available</div>
                <div>
                  {!articles.data && !categories.data && (
                    <div>
                      No Categories or Articles Available (Probably still
                      loading)
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
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
                <div className="mb-4 flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="mb-4 flex items-center justify-between text-sm text-red-400">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{article.createdAt.toDateString()}</span>
                    </div>
                  </div>
                </div>
                {currentArticle === article.href_title_date && (
                  <div className="mb-4 items-center justify-between text-sm text-red-400">
                    <p>{article.text}</p>
                    <div>
                      {article.href_links && article.href_links.length > 0 && (
                        <HrefLinks href_links={article.href_links} />
                      )}
                    </div>
                  </div>
                )}
                {currentArticle !== article.href_title_date && (
                  <button
                    onClick={() => {
                      setcurrentArticle(article.href_title_date);
                    }}
                    className={`read-article-button relative w-full overflow-hidden bg-red-600 py-2 text-white transition-colors duration-300`}
                    onMouseEnter={() =>
                      handle_loading_animation(true, article.href_title_date)
                    }
                    onMouseLeave={() => handle_loading_animation(false, "")}
                  >
                    <div
                      className={`absolute inset-0 z-10 h-full w-full transition-transform duration-300 ${
                        isLoading &&
                        article.href_title_date === isLoading_button
                          ? "translate-x-0 transform bg-red-700"
                          : "-translate-x-full transform"
                      }`}
                      style={{
                        transition: "transform 1s ease-in-out",
                      }}
                    />
                    <div className="relative z-10">
                      {isLoading && article.href_title_date === isLoading_button
                        ? "PENETRATING MEGACORPORATION FIREWALL"
                        : "Read Full Article"}
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
            &copy; 2077 CyberNews. All rights augmented by Dusan Bojanic-2024
          </p>
        </div>
      </footer>
    </div>
  );
}
