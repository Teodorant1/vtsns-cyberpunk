"'use client'"

import { Search, Menu, ChevronRight, Eye, Clock, ThumbsUp } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Progress } from "~/components/ui/progress"
import { useState, useEffect } from "react"

export function CyberpunkNews() {
  const [progress, setProgress] = useState(13)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  const articles = [
    {
      title: "AI Singularity: The Day Machines Outsmarted Humanity",
      excerpt: "In a shocking turn of events, artificial intelligence has reached level sophistication that surpasses human cognitive abilities...",
      author: "Zoe Nexus",
      date: "2077-06-15",
      readTime: 5,
      views: 1500000,
      likes: 95,
    },
    {
      title: "Cybernetic Implants Now Mandatory for All Citizens",
      excerpt: "The government has announced a controversial new policy requiring all citizens to undergo cybernetic enhancement...",
      author: "Rex Voltage",
      date: "2077-06-14",
      readTime: 7,
      views: 2000000,
      likes: 88,
    },
    {
      title: "Virtual Reality Addiction Reaches Epidemic Proportions",
      excerpt: "Hospitals are overwhelmed as millions of people struggle to disconnect from immersive virtual worlds...",
      author: "Luna Stardust",
      date: "2077-06-13",
      readTime: 6,
      views: 1800000,
      likes: 92,
    },
    {
      title: "Megacorporation Wars: The Battle for Neo-Tokyo",
      excerpt: "Armed conflicts between rival megacorporations have turned the streets of Neo-Tokyo into a battleground...",
      author: "Blade Runner",
      date: "2077-06-12",
      readTime: 8,
      views: 2500000,
      likes: 97,
    },
  ]

  return (
    <div className="min-h-screen bg-black text-red-500">
      <style jsx>{`
        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 rgba(255,0,0,0.75),
                         -0.05em -0.025em 0 rgba(0,255,0,0.75),
                         -0.025em 0.05em 0 rgba(0,0,255,0.75);
          }
          14% {
            text-shadow: 0.05em 0 0 rgba(255,0,0,0.75),
                         -0.05em -0.025em 0 rgba(0,255,0,0.75),
                         -0.025em 0.05em 0 rgba(0,0,255,0.75);
          }
          15% {
            text-shadow: -0.05em -0.025em 0 rgba(255,0,0,0.75),
                         0.025em 0.025em 0 rgba(0,255,0,0.75),
                         -0.05em -0.05em 0 rgba(0,0,255,0.75);
          }
          49% {
            text-shadow: -0.05em -0.025em 0 rgba(255,0,0,0.75),
                         0.025em 0.025em 0 rgba(0,255,0,0.75),
                         -0.05em -0.05em 0 rgba(0,0,255,0.75);
          }
          50% {
            text-shadow: 0.025em 0.05em 0 rgba(255,0,0,0.75),
                         0.05em 0 0 rgba(0,255,0,0.75),
                         0 -0.05em 0 rgba(0,0,255,0.75);
          }
          99% {
            text-shadow: 0.025em 0.05em 0 rgba(255,0,0,0.75),
                         0.05em 0 0 rgba(0,255,0,0.75),
                         0 -0.05em 0 rgba(0,0,255,0.75);
          }
          100% {
            text-shadow: -0.025em 0 0 rgba(255,0,0,0.75),
                         -0.025em -0.025em 0 rgba(0,255,0,0.75),
                         -0.025em -0.05em 0 rgba(0,0,255,0.75);
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
          background: linear-gradient(to bottom, transparent, rgba(255,0,0,0.2), transparent);
          pointer-events: none;
          animation: scanline 10s linear infinite;
        }
      `}</style>

      <div className="scanline"></div>

      <header className="border-b border-red-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wider text-red-600 glitch" style={{ textShadow: "2px 4px rgba(255,0,0,0.5)" }}>
            CYBER<span className="text-white">NEWS</span>
          </h1>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li><a href="#" className="hover:text-red-400 transition-colors">Headlines</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Tech</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Politics</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Netwatch</a></li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400 hover:bg-red-900/20">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden text-red-500 hover:text-red-400 hover:bg-red-900/20">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <h2 className="text-3xl font-bold mb-6 text-white glitch">Breaking News</h2>
        <div className="space-y-6">
          {articles.map((article, index) => (
            <div key={index} className="bg-gray-900 border border-neutral-200 border-red-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-red-500/20 transition-shadow p-6 dark:border-neutral-800">
              <h3 className="text-2xl font-semibold text-white mb-2 glitch">{article.title}</h3>
              <p className="text-red-300 mb-4">{article.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-red-400 mb-4">
                <span>{article.author}</span>
                <span>{article.date}</span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{article.readTime} min read</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="text-sm">{article.views.toLocaleString()} views</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-red-300 mb-1">Engagement</p>
                <Progress value={article.likes} className="h-2 bg-red-900">
                  <div className="h-full bg-red-500 transition-all duration-500 ease-in-out" style={{ width: `${article.likes}%` }} />
                </Progress>
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Read Full Article
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-gray-900 border-t border-red-800 mt-12 py-6">
        <div className="container mx-auto text-center">
          <p className="text-red-400 glitch">&copy; 2077 CyberNews. All rights augmented.</p>
        </div>
      </footer>
    </div>
  )
}