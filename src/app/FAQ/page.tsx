// FAQPage.tsx
"use client";
import { useState } from "react";
import { Clock } from "lucide-react";

export default function FAQPage() {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const toggleQuestion = (question: string) => {
    setActiveQuestion((prev) => (prev === question ? null : question));
  };

  const faqs = [
    {
      question: "What is this website?",
      answer:
        "This website is an article aggregator for the  announcements page at https://vtsns.edu.rs/predmeti-info/ , I made this app because that page is bugged and constantly shows old articles and it doesn't have any filtering capabilities. Because of that I made my own version and put a Cyberpunk spin on it.",
    },
    {
      question: "What is Web Scraping?",
      answer:
        "Web scraping’s the closest you’ll get to liberation in this cyberpunk dystopia. It’s ripping out data from websites, bending it to your will.",
    },
    {
      question: "Is Web Scraping legal?",
      answer:
        "Depends. Megacorporations will scream it’s illegal, but they’ve always been hypocrites. If you’re smart, you don’t leave a trace.",
    },
    {
      question: "Do I need coding skills?",
      answer:
        "Hell yeah. Unless you’re planning to scrape with toy tools, you need to know your way around code to dance with the devil.",
    },
    {
      question: "What tools do I need?",
      answer:
        "Python, Playwright, Puppeteer, BeautifulSoup, you name it. The bigger the beast, the sharper the weapon.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-red-500">
      <div className="scanline"></div>
      <main className="container mx-auto py-8">
        <h1 className="glitch mb-8 flex items-center text-3xl font-bold text-white">
          Web Scraping{" "}
          <h1
            className="glitch mx-5 flex text-2xl font-bold tracking-wider text-red-600"
            style={{ textShadow: "2px 2px 4px rgba(255,0,0,0.5)" }}
          >
            FAQ
          </h1>
        </h1>
        <section className="space-y-6">
          {faqs.map((faq) => (
            <div
              onClick={() => toggleQuestion(faq.question)}
              key={faq.question}
              className={`overflow-hidden rounded-lg border border-red-800 bg-gray-900 p-6 transition-shadow ${
                activeQuestion === faq.question
                  ? "shadow-lg shadow-red-500/20"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="glitch cursor-pointer text-xl font-semibold">
                  {faq.question}
                </h3>
              </div>
              {activeQuestion === faq.question && (
                <p className="animate-slide-fade-in mt-4 text-red-300">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </section>
      </main>
      <footer className="mt-12 border-t border-red-800 bg-gray-900 py-6">
        <div className="container mx-auto text-center">
          <p className="glitch text-red-400">
            &copy; 2077 CyberScraper. Powered by raw defiance, styled by the
            shadows.
          </p>
        </div>
      </footer>
    </div>
  );
}
